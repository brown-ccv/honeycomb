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
export function tag(tag, children, attributes = {}) {
  let attributesString;
  if (Object.keys(attributes).length === 0) {
    // No attributes
    attributesString = "";
  } else {
    attributesString =
      " " + // Prepend an empty space to separate attributes from tag
      Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
  }

  return `<${tag}${attributesString}>${children}</${tag}>`;
}

/**
 * Wraps a given string in an b tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function b(children, attributes = {}) {
  return tag("b", children, attributes);
}

/**
 * Returns a break tag
 */
export function br() {
  return "<br />";
}

/**
 * Wraps a given string in an div tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function div(children, attributes = {}) {
  return tag("div", children, attributes);
}

/**
 * Wraps a given string in an h1 tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function h1(children, attributes = {}) {
  return tag("h1", children, attributes);
}

/**
 * Wraps a given string in an em tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function i(children, attributes = {}) {
  return tag("i", children, attributes);
}

/**
 * Creates an image tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function image(attributes = {}) {
  return tag("img", "", attributes);
}

/**
 * Wraps a given string in an paragraph tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function p(children, attributes = {}) {
  return tag("p", children, attributes);
}

/**
 * Wraps a given string in an span tag
 * @param {string} children The children of the HTML tag
 * @param {object} attributes HTML attributes to add to the tag
 * @returns {string} A string containing static HTML
 */
export function span(children, attributes = {}) {
  return tag("span", children, attributes);
}
