'use strict';

var _ = require('underscore');
var faker = require('faker');

module.exports = function generateMultipartData(endpoint) {
  var returnData = {};

  if (_.has(endpoint, 'generation')) {
    _.keys(endpoint.generation).forEach((dataKey) => {
      var splitFakerName = endpoint.generation[dataKey].split('.');
      console.log('generation', dataKey, endpoint.generation[dataKey]);
      returnData[dataKey] = {
        "key": dataKey,
        "value": (endpoint.generation[dataKey] === 'file') ? '' : faker[splitFakerName[0]][splitFakerName[1]](),
        "type": (endpoint.generation[dataKey] === 'file') ? 'file' : 'text',
        "enabled": "true"
      }
    });
  } else if (_.has(endpoint, 'validation')) {
    _.keys(endpoint.validation).forEach((dataKey) => {
      returnData[dataKey] = {
        "key": dataKey,
        "value": '',
        "type": (endpoint.validation[dataKey] === 'file') ? 'file' : 'text',
        "enabled": "true"
      }
    });
  } else if (_.has(endpoint, 'data') && endpoint.data.length > 0) {
    _.keys(endpoint.data[0]).forEach((dataKey) => {
      returnData[dataKey] = {
        "key": dataKey,
        "value": '',
        "type": 'text',
        "enabled": "true"
      }
    });
  }

  return returnData;
};
