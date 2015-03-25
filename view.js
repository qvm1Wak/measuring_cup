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
    this.ESCAPE_KEY = 27;
    this.$list = qs('.list');
    this.$main = qs('#main');
    this.$newItem = $('.new-item');
    this.$newItemButton = $('.new-item-button');
    this.removeItemSelector = '.remove-item-button';
    this.$itemList = $('.item-list');
    this.handlers = { newItem: [], removeItem: [] };

    var that = this;
    
    $(this.$newItemButton).on('click', function () {
      _.each(that.handlers['newItem'], (handler) => { handler(that.$newItem.val()); });
      that.$newItem.val('');
      // that.$newItem.blur();
    });
    $(this.$newItem).on('keypress', function (event) {
      if (event.keyCode === that.ENTER_KEY) {
        _.each(that.handlers['newItem'], (handler) => { handler(that.$newItem.val()); });
        that.$newItem.val('');
        // that.$newItem.blur();
      }
    });
    $('body').on('click', this.removeItemSelector, function () {
      var $li = $(this).closest('li');
      _.each(that.handlers['removeItem'], (handler) => { handler($li.attr('data-id')); });
    });
  }

  _clearCompletedButton (completedCount, visible) {
    this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
    this.$clearCompleted.style.display = visible ? 'block' : 'none';
  }
  _setFilter (currentPage) {
    qs('#filters .selected').className = '';
    qs('#filters [href="#/' + currentPage + '"]').className = 'selected';
  }
  _elementComplete (id, completed) {
    var listItem = qs('[data-id="' + id + '"]');
    if (!listItem) {
      return;
    }
    listItem.className = completed ? 'completed' : '';
    // In case it was toggled from an event and not by clicking the checkbox
    qs('input', listItem).checked = completed;
  }
  _editItem (id, title) {
    var listItem = qs('[data-id="' + id + '"]');
    if (!listItem) {
      return;
    }
    listItem.className = listItem.className + ' editing';
    var input = document.createElement('input');
    input.className = 'edit';
    listItem.appendChild(input);
    input.focus();
    input.value = title;
  }
  _editItemDone (id, title) {
    var listItem = qs('[data-id="' + id + '"]');
    if (!listItem) {
      return;
    }
    var input = qs('input.edit', listItem);
    listItem.removeChild(input);
    listItem.className = listItem.className.replace('editing', '');
    qsa('label', listItem).forEach(function (label) {
      label.textContent = title;
    });
  }
  focus () {
    this.$newItem.focus();
  }
  render (viewCmd, parameter) {
    var that = this;
    var viewCommands = {
      showItemList: function () {
        that.$itemList.html(that.template.show(parameter));
      },
      clearNewItem: function () {
        that.$newItem.value = '';
      }
    };
    viewCommands[viewCmd]();
  }
  _itemId (element) {
    var li = $parent(element, 'li');
    return parseInt(li.dataset.id, 10);
  }
  _bindItemEditDone (handler) {
    $live('#todo-list li .edit', 'blur', function () {
      if (!this.dataset.iscanceled) {
        handler({
          id: this._itemId(this),
          title: this.value
        });
      }
    });
    $live('#todo-list li .edit', 'keypress', function (event) {
      if (event.keyCode === this.ENTER_KEY) {
        // Remove the cursor from the input when you hit enter just like if it
        // were a real form
        this.blur();
      }
    });
  }
  _bindItemEditCancel (handler) {
    $live('#todo-list li .edit', 'keyup', function (event) {
      if (event.keyCode === this.ESCAPE_KEY) {
        this.dataset.iscanceled = true;
        this.blur();
        handler({id: this._itemId(this)});
      }
    });
  }
  bind (event, handler) {
    this.handlers[event].push(handler);
  }
}

export default View;
