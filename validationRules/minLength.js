'use strict';

var restify = require('restify');

module.exports = function minLength(elementName, requestValue, elementValue) {
    if (requestValue.length < elementValue) {
        return new restify.errors.InvalidContentError('Validation error: The length of "' + elementName + '" should be higher than "' + elementValue + '"');
    }
    return true;
};