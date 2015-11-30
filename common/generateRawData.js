"use strict";

var _ = require('underscore');
var faker = require('faker');

module.exports = function generateRawData(endpoint) {
    var returnData = {};

    if (_.has(endpoint, 'generation')) {
        _.keys(endpoint.generation).forEach((dataKey) => {
            var splitFakerName = endpoint.generation[dataKey].split('.');
            returnData[dataKey] = faker[splitFakerName[0]][splitFakerName[1]]();
        });
    } else if (_.has(endpoint, 'validation')) {
        _.keys(endpoint.validation).forEach((dataKey) => {
            returnData[dataKey] = ""
        });
    } else if (_.has(endpoint, 'data') && endpoint['data'].length > 0) {
        _.keys(endpoint.data[0]).forEach((dataKey) => {
            returnData[dataKey] = ""
        });
    }

    return returnData;
};