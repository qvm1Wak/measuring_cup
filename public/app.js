import $ from 'jquery';
import _ from 'lodash';
import solve from 'jsLPSolver';
import './helpers';
import Store from './store';
import Model from './model';
import View from './view';
import Controller from './controller';
import Template from './template';

$(() => {
  /**
   * Sets up a brand new Recipe ingredients list.
   *
   * @param {string} name The name of your new list.
   */
  class Recipe {
    constructor(name) {
      this.storage = new Store(name);
      this.model = new Model(this.storage);
      this.template = new Template();
      this.view = new View(this.template);
      this.controller = new Controller(this.model, this.view);
    }
    
    setView () {
      this.controller.setView(document.location.hash);
    }
  }
  
  var recipe = new Recipe('recipe');

  recipe.setView();

  $(window).on('hashchange', recipe.setView);
});
