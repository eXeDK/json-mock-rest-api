'use strict';

var restify = require('restify');
var _ = require('underscore');

module.exports = function validateInput(endpointValidationRules) {

  return function(req, res, next) {

    _.keys(endpointValidationRules).forEach((elementName) => {
      var elementValidationRules = endpointValidationRules[elementName];

      if (typeof elementValidationRules === 'string') {
        // If only type was set
        validateSingleInput('type', elementName, elementValidationRules);
      } else if (typeof elementValidationRules === 'object') {
        // If more than one validation rule was set

        _.keys(elementValidationRules).forEach((validationName) => {
          var validationValue = elementValidationRules[validationName];
          validateSingleInput(validationName, elementName, validationValue);
        });
      } else {
        return next(new restify.errors.InternalError(
          'Validation data not correct'
        ));
      }
    });
    return next();

    function validateSingleInput(validationName, elementName, expectedValue) {
      var rulePath = './validationRules/' + validationName;
      var validationResult =
        require(rulePath)(elementName, req.body[elementName], expectedValue);
      if (validationResult !== true) {
        return next(validationResult);
      }
    }

    // Validate that data supplied was correct
    // Loop through validation rules
    // Run each validation rule, return error if any occured

    // Tell the developer if there was unexpected data
  };
};
