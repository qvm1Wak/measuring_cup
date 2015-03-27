import $ from 'jquery';
import _ from 'lodash';
import solve from 'jsLPSolver';

/**
 * Takes a model and view and acts as the controller between them
 *
 * @constructor
 * @param {object} model The model instance
 * @param {object} view The view instance
 */
class Controller {
  constructor (model, view) {
    var that = this;
    this.model = model;
    this.view = view;
    this.view.bind('newItem', item => {
      that.addItem(item);
    });
    this.view.bind('removeItem', id => {
      that.removeItem(id);
    });
    // this.model.removeAll();
    that.model.read((data) => { that.refreshUIFromDB(data); });
  }

  /**
   * Loads and initialises the view
   *
   * @param {string} '' | 'active' | 'completed'
   */
  setView (locationHash) {
    var route = locationHash.split('/')[1];
    var page = route || '';
    this._activeRoute = page;
    if (page === '') {
      this._activeRoute = 'All';
      this.view.render('focus');
    }
    // TODO handle page transition details
  }

  refreshUIFromDB (data) {
    var that = this;
    var foodItems = _.filter(data, item => { return item.title.startsWith('food_number:'); });
    var query = _.map(_.pluck(foodItems, 'title'), item => {
      return item.slice('food_number:'.length);
    });
    if (!foodItems.length) {
      that.view.render('showItemList', []);
      return;
    }
    $.ajax({
      url: 'ingredients/' + query
    }).done(function(ingredientData) {
      var computedData = that.computeQuantities(ingredientData);
      var index = _.indexBy(computedData, 'food_number');
      var viewData = data.map(item => {
        var id = item.title.startsWith('food_number:') ? item.title.slice('food_number:'.length) : item.title;
        if (index[id]) { return _.extend({id: item.id}, index[id]); };
        return {
          id: item.id,
          long_description: item.title
        };
      });
      that.view.render('showItemList', viewData);
    });
  }
  
  /**
   * An event to fire whenever you want to add an item. Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   */
  addItem (item) {
    var that = this;
    if (item.long_description.trim() === '') {
      return;
    }
    var toSave = !!item.food_number ? 'food_number:' + item.food_number : item.long_description;
    
    this.model.create(toSave, () => {
      that.view.render('clearNewItem');
      that.model.read((data) => { that.refreshUIFromDB(data); });
    });
  }

  /**
   * By giving it an ID it'll find the DOM element matching this ID,
   * remove it from the DOM and also remove it from storage.
   *
   * @param {number} id The ID of the item to remove from the DOM and
   * storage
   */
  removeItem (id) {
    var that = this;
    this.model.remove(id, () => {
      that.model.read((data) => { that.refreshUIFromDB(data); });
    });
  }

  saveAllItems () {
    this.model.read(data => {
      // save the list somewhere
      // this.view.render('saveRecipe', data);
    });
  }

  computeQuantities (data) {
    data = data.map(item => {
      var keys = Object.keys(item);
      var keyValues = keys.map(key => {
        if (item[key] && item[key].value) return {key: key, value: item[key].value};
        return {key: key, value: item[key]};
      });
      return keyValues.reduce((memo, pair) => { memo[pair.key] = pair.value; return memo; }, {});
    });
    var index = _.indexBy(data, 'long_description');
    var constraints = {
      protein: {min:85, max: 95},
      'total lipid (fat)': {min:75, max: 85},
      'carbohydrate, by difference': {min:225, max:275},
      energy: {min: 1980, max:2020}
    };
    var solver = new Solver,
        results,
        model = {
          optimize: "energy",
          opType: "min",
          constraints: constraints,
          variables: index
          // ints: {
          //   aor_ortho_core: 1,
          // }
        };

    var isNumeric = n => {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    var twoDecimal = n => {
      return parseFloat(Math.round(n * 100) / 100).toFixed(2);
    };

    results = solver.Solve(model);

    // multiply the recommended ratios by the ingredient quantities
    return Object.keys(index).reduce((memo, ingredientName) => {
      var ingredient = index[ingredientName];
      var multiplier = results[ingredientName] ? results[ingredientName] : 0;
      var nutrient;
      var computedIngredient = {};
      computedIngredient.multiplier_recommended = multiplier;
      computedIngredient.quantity_recommended = twoDecimal(multiplier * 100);
      for (nutrient in ingredient) {
        computedIngredient[nutrient] = (isNumeric(+ingredient[nutrient]) && nutrient !== 'food_number') ? +ingredient[nutrient] : ingredient[nutrient];
        if (nutrient in constraints && ingredientName in results) {
          computedIngredient[nutrient + '_recommended'] = +ingredient[nutrient] * multiplier;
        }
        if (nutrient in constraints && !(ingredientName in results)) {
          computedIngredient[nutrient + '_recommended'] = 0;
        }
      }
      memo.push(computedIngredient);
      return memo;
    }, []);
  }
}

export default Controller;
