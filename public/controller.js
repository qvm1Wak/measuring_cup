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
      that.model.read((data) => {
        var foodItems = _.filter(data, item => { return item.title.startsWith('food_number:'); });
        var query = _.map(_.pluck(foodItems, 'title'), item => {
          return item.slice('food_number:'.length);
        });
        $.ajax({
          url: 'ingredients/' + query
        }).done(function(ingredientData) {
          // compute simplex
          console.log(data);
          var index = _.indexBy(ingredientData, 'food_number');
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
      });
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
    console.log(id);
    this.model.remove(id, () => {
      that.model.read(data => {
        var foodItems = _.filter(data, item => { return item.title.startsWith('food_number:'); });
        var query = _.map(_.pluck(foodItems, 'title'), item => {
          return item.slice('food_number:'.length);
        });
        $.ajax({
          url: 'ingredients/' + query
        }).done(function(ingredientData) {
          // compute simplex
          console.log(data);
          var index = _.indexBy(ingredientData, 'food_number');
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
      });
    });
  }

  saveAllItems () {
    this.model.read(data => {
      // save the list somewhere
      // this.view.render('saveRecipe', data);
    });
  }

  computeQuantities (data) {
    var solver = new solve.Solver(),
        results,
        model = {
          optimize: "item_cost",
          opType: "min",
          constraints: {
            "protein": {min:85, max: 95},
            "fat": {min:75, max: 85},
            "carbs": {min:225, max:275},
            "calories": {min: 1980, max:2020}
          },
          variables: data,
          // ints: {
          //   aor_ortho_core: 1,
          //   choline_bitartrate: 1
          // }
        };

    var isNumeric = n => {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    results = solver.Solve(model);

    var quantities = Object.keys(results).reduce((memo, result) => {
      if (result in data) {
        memo[result] = {
          amount: data[result].serving * results[result]
          //calories: ingredients[result].calories * results[result]
        };
      }
      return memo;
    }, {});

    console.log(quantities);

  }
}

export default Controller;
