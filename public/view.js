/*global qs, qsa, $on, $parent, $live */

import $ from 'jquery';
import _ from 'lodash';
import typeahead from 'typeahead.js';

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



    var substringMatcher = function(strs) {
      console.log('substring matcher');
      return function findMatches(q, cb) {
        console.log('substring matcher a');
        var matches, substrRegex;
        
        // an array that will be populated with substring matches
        matches = [];
        
        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');
        
        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            // the typeahead jQuery plugin expects suggestions to a
            // JavaScript object, refer to typeahead docs for more info
            matches.push({ value: str });
          }
        });
        
        cb(matches);
      };
    };
    
    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
                  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
                  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
                  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
                  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
                  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
                  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
                  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
                  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
                 ];

    this.$newItem.typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      displayKey: 'value',
      source: substringMatcher(states)
    });



    
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
