/*global qs, qsa, $on, $parent, $live */

import $ from 'jquery';
import _ from 'lodash';

/**
 * View that abstracts away the browser's DOM completely.
 * It has two simple entry points:
 *
 * - bind(eventName, handler)
 * Takes a todo application event and registers the handler
 * - render(command, parameterObject)
 * Renders the given command with the options
 */
class View {
  constructor (template) {
    this.template = template;
    this.ENTER_KEY = 13;
    this.$newItem = $('.new-item');
    this.$newItemButton = $('.new-item-button');
    this.removeItemSelector = '.remove-item-button';
    this.$itemList = $('.item-list');
    this.handlers = { newItem: [], removeItem: [] };

    var that = this;
    
    $(this.$newItemButton).on('click', () => {
      _.each(that.handlers['newItem'], (handler) => { handler(that.$newItem.val()); });
      that.$newItem.val('');
    });
    $(this.$newItem).on('keypress', (event) => {
      if (event.keyCode === that.ENTER_KEY) {
        _.each(that.handlers['newItem'], (handler) => { handler(that.$newItem.val()); });
        that.$newItem.val('');
      }
    });
    $('body').on('click', this.removeItemSelector, (e) => {
      var $li = $(e.currentTarget).closest('li');
      _.each(that.handlers['removeItem'], (handler) => { handler($li.attr('data-id')); });
    });
  }

  render (viewCmd, parameter) {
    var that = this;
    var viewCommands = {
      showItemList: () => {
        that.$itemList.html(that.template.show(parameter));
      },
      clearNewItem: () => {
        that.$newItem.value = '';
      },
      focus: () => {
        that.$newItem.focus();
      }
    };
    viewCommands[viewCmd]();
  }

  bind (event, handler) {
    this.handlers[event].push(handler);
  }
}

export default View;
