'use strict';

var commandLineArgs = require('command-line-args');
var _ = require('underscore');
var uuid = require('uuid');
var fs = require('fs');
var faker = require('faker');
var generateRawData = require('./common/generateRawData');

var cli = commandLineArgs([
  {name: 'config', alias: 'i', type: String},
  {name: 'number', alias: 'n', type: Number, defaultOption: 10},
  {name: 'debug', alias: 'd', type: Boolean},
  {name: 'replaceData', alias: 'r', type: Boolean}
]);

var options = cli.parse();
if (!_.has(options, 'config') || options.config.length == 0) {
  console.log(cli.getUsage());
}

// Load in the data
var data = require(options.config);

_.keys(data).forEach((endpointName) => {
  // Make sure there is a data array
  if (!_.has(data[endpointName], 'data')) {
    data[endpointName].data = [];
  }

  for (var i = 0; i <= options.number; i++) {
    data[endpointName].data.push(generateRawData(data[endpointName]));
  }
});

fs.writeFileSync('dataOutput.json', JSON.stringify(data, null, 2));
