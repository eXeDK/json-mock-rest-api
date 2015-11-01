'use strict';

var restify = require('restify');

module.exports = function required(elementName, requestValue, elementValue) {
    if (typeof requestValue === 'undefined') {
        return new restify.errors.InvalidContentError('Validation error: "' + elementName + '" is required!');
    }
    return true;
};