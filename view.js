/*global qs, qsa, $on, $parent, $live */

import $ from 'jquery';

/**
 * View that abstracts away the browser's DOM completely.
 * It has two simple entry points:
 *
 * - bind(eventName, handler)
 * Takes a todo application event and registers the handler
 * - render(command, parameterObject)
 * Renders the given command with the options
 */
function View(template) {
  this.template = template;
  this.ENTER_KEY = 13;
  this.ESCAPE_KEY = 27;
  this.$list = qs('.list');
  this.$main = qs('#main');
  this.$newIngredient = qs('.new-ingredient');
}
View.prototype._removeItem = function (id) {
  var elem = qs('[data-id="' + id + '"]');
  if (elem) {
    this.$todoList.removeChild(elem);
  }
};
View.prototype._clearCompletedButton = function (completedCount, visible) {
  this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
  this.$clearCompleted.style.display = visible ? 'block' : 'none';
};
View.prototype._setFilter = function (currentPage) {
  qs('#filters .selected').className = '';
  qs('#filters [href="#/' + currentPage + '"]').className = 'selected';
};
View.prototype._elementComplete = function (id, completed) {
  var listItem = qs('[data-id="' + id + '"]');
  if (!listItem) {
    return;
  }
  listItem.className = completed ? 'completed' : '';
  // In case it was toggled from an event and not by clicking the checkbox
  qs('input', listItem).checked = completed;
};
View.prototype._editItem = function (id, title) {
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
};
View.prototype._editItemDone = function (id, title) {
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
};
View.prototype.render = function (viewCmd, parameter) {
  var that = this;
  var viewCommands = {
    showEntries: function () {
      that.$todoList.innerHTML = that.template.show(parameter);
    },
    removeItem: function () {
      that._removeItem(parameter);
    },
    clearNewTodo: function () {
      that.$newIngredient.value = '';
    }
  };
  viewCommands[viewCmd]();
};
View.prototype._itemId = function (element) {
  var li = $parent(element, 'li');
  return parseInt(li.dataset.id, 10);
};
View.prototype._bindItemEditDone = function (handler) {
  var that = this;
  $live('#todo-list li .edit', 'blur', function () {
    if (!this.dataset.iscanceled) {
      handler({
        id: that._itemId(this),
        title: this.value
      });
    }
  });
  $live('#todo-list li .edit', 'keypress', function (event) {
    if (event.keyCode === that.ENTER_KEY) {
      // Remove the cursor from the input when you hit enter just like if it
      // were a real form
      this.blur();
    }
  });
};
View.prototype._bindItemEditCancel = function (handler) {
  var that = this;
  $live('#todo-list li .edit', 'keyup', function (event) {
    if (event.keyCode === that.ESCAPE_KEY) {
      this.dataset.iscanceled = true;
      this.blur();
      handler({id: that._itemId(this)});
    }
  });
};
View.prototype.bind = function (event, handler) {
  var that = this;
  if (event === 'newIngredient') {
    $(that.$newIngredient).on('change', function () {
      handler(that.$newIngredient.value);
    });
  }
};

export default View;
