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
    this.view.bind('newItem', function (title) {
      that.addItem(title);
    });
  }

  // return;
  // this.view.bind('itemEdit', function (item) {
  //   this.editItem(item.id);
  // });
  // this.view.bind('itemEditDone', function (item) {
  //   this.editItemSave(item.id, item.title);
  // });

  /**
   * Loads and initialises the view
   *
   * @param {string} '' | 'active' | 'completed'
   */
  setView (locationHash) {
    var route = locationHash.split('/')[1];
    var page = route || '';
    // this._activeRoute = page;
    // if (page === '') {
    //   this._activeRoute = 'All';
    // }
    // TODO handle page transition details
  }

  /**
   * An event to fire whenever you want to add an item. Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   */
  addItem (title) {
    var that = this;
    if (title.trim() === '') {
      return;
    }
    this.model.create(title, function () {
      that.view.render('clearNewItem');
      // this._filter(true);
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
    this.model.remove(id, function () {
      this.view.render('removeItem', id);
    });
    this._filter();
  }

  saveAllItems () {
    this.model.read(function (data) {
      // save the list somewhere
      // this.view.render('saveRecipe', data);
    });
  }
}

export default Controller;
