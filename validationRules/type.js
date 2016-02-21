'use strict';

var restify = require('restify');

module.exports = function type(elementName, requestValue, elementValue) {
  if (elementValue == 'number') {
    if (!Number(requestValue)) {
      return new restify.errors.InvalidContentError(
        'Validation error: "' + elementName +
        '" should be an "' + elementValue + '"'
      );
    }
  } else {
    if (requestValue.constructor.name.toLowerCase() !== elementValue
      && typeof requestValue !== elementValue) {
      return new restify.errors.InvalidContentError(
        'Validation error: "' + elementName +
        '" should be an "' + elementValue + '"'
      );
    }
  }
  return true;
};
