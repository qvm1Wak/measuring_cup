/*jshint laxbreak:true */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;',
  '`': '&#x60;'
};
var escapeHtmlChar = function (chr) {
  return htmlEscapes[chr];
};
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);
var escape = function (string) {
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
};
/**
 * Sets up defaults for all the Template methods such as a default template
 *
 * @constructor
 */
function Template() {
  this.defaultTemplate
    =	'<li data-id="{{id}}">'
    +	'<div class="view">'
    +	'{{title}}'
    +	'<button class="remove-item-button"></button>'
    +	'</div>'
    +	'</li>';
}
/**
 * Creates an <li> HTML string and returns it for placement in your app.
 *
 * NOTE: In real life you should be using a templating engine such as Mustache
 * or Handlebars, however, this is a vanilla JS example.
 *
 * @param {object} data The object containing keys you want to find in the
 * template to replace.
 * @returns {string} HTML String of an <li> element
 *
 * @example
 * view.show({
 * id: 1,
 * title: "Hello World",
 * });
 */
Template.prototype.show = function (data) {
  var i, l;
  var view = '';
  for (i = 0, l = data.length; i < l; i++) {
    var template = this.defaultTemplate;
    template = template.replace('{{id}}', data[i].id);
    template = template.replace('{{title}}', escape(data[i].title));
    view = view + template;
  }
  return view;
};

export default Template;
