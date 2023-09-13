/**
 * This file contains the static markup for various HTML tags.
 * These can be used to wrap your language in specific HTML tags for the JsPSych stimulus.
 */
// TODO: Base function that injects the tag

function h1(children, attributes = {}) {
  const attributesString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  console.log(attributes, attributesString);
  return `<h1 ${attributesString}>${children}</h1>`;
}

export { h1 };
