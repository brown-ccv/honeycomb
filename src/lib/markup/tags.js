/**
 * This file contains the static markup for various HTML tags.
 * These can be used to wrap your language in specific HTML tags for the JsPSych stimulus.
 */

/**
 * Wraps a given string in the given tag
 * @param {string} tag The HTML tag to use
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function tag(tag, children, attributes = {}) {
  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `<${tag} ${attributesString}>${children}</${tag}>`;
}

/**
 * Wraps a given string in an div tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function div(children, attributes = {}) {
  return tag("div", children, attributes);
}

/**
 * Wraps a given string in an span tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function span(children, attributes = {}) {
  return tag("span", children, attributes);
}

/**
 * Wraps a given string in an h1 tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function h1(children, attributes = {}) {
  return tag("h1", children, attributes);
}

/**
 * Wraps a given string in an paragraph tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function p(children, attributes = {}) {
  return tag("p", children, attributes);
}

/**
 * Wraps a given string in an b tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function b(children, attributes = {}) {
  return tag("b", children, attributes);
}

/**
 * Wraps a given string in an em tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function i(children, attributes = {}) {
  return tag("i", children, attributes);
}

/**
 * Creates an image tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
function image(attributes = {}) {
  return tag("img", "", attributes);
}

/**
 * Returns a break tag
 */
function br() {
  return "<br />";
}

export { b, br, div, h1, i, image, p, span, tag };
