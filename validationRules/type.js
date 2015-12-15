'use strict';

var restify = require('restify');

module.exports = function type(elementName, requestValue, elementValue) {
  if (typeof requestValue !== elementValue) {
    return new restify.errors.InvalidContentError(
      'Validation error: "' + elementName +
      '" should be an "' + elementValue + '"'
    );
  }
  return true;
};
