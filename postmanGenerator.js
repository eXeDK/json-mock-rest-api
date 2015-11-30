'use strict';

var commandLineArgs = require('command-line-args');
var _               = require('underscore');
var uuid            = require('uuid');
var fs              = require('fs');
var faker           = require('faker');
var config          = require('./config');
var generateRawData = require('./common/generateRawData');

var cli = commandLineArgs([
    {name: 'input', alias: 'i', type: String},
    {name: 'debug', alias: 'd', type: Boolean, defaultOption: false}
]);

var options = cli.parse();

if (!_.has(options, 'input') || options.input.length == 0) {
    console.log(cli.getUsage());
}

// Load in the data
var data        = require(config.data);
var postmanData = {
    "id": uuid.v4(),
    "name": "Generated Postman Collection",
    "order": [],
    "folders": [],
    timestamp: 0,
    "owner": null,
    "remoteLink": null,
    "public": false,
    "requests": []
};

_.keys(data).forEach((endpointName) => {
    postmanData.folders.push({
        "id": uuid.v4(),
        "name": endpointName,
        "description": "",
        "order": [],
        "owner": null
    });
    var folderIndex = findEndpointFolderIndex(endpointName, postmanData);

    // Generate GET all request
    var id = uuid.v4();
    postmanData.requests.push({
        "id": id,
        "headers": "",
        "url": "http://localhost:8080/" + endpointName,
        "pathVariables": {},
        "preRequestScript": "",
        "method": "GET",
        "collectionId": postmanData.id,
        "data": [],
        "dataMode": "params",
        "name": "Get all " + endpointName,
        "description": "",
        "descriptionFormat": "html",
        "time": new Date().getTime(),
        "version": 2,
        "responses": [],
        "tests": "",
        "currentHelper": "normal",
        "helperAttributes": {},
        folder: postmanData.folders[folderIndex].id
    });
    postmanData.folders[folderIndex].order.push(id);

    // Generate GET specific datapoint request
    id = uuid.v4();
    postmanData.requests.push({
        "id": id,
        "headers": "",
        "url": "http://localhost:8080/" + endpointName +"/:id",
        "pathVariables": {},
        "preRequestScript": "",
        "method": "GET",
        "collectionId": postmanData.id,
        "data": [],
        "dataMode": "params",
        "name": "Get specific " + endpointName,
        "description": "",
        "descriptionFormat": "html",
        "time": new Date().getTime(),
        "version": 2,
        "responses": [],
        "tests": "",
        "currentHelper": "normal",
        "helperAttributes": {},
        "folder": postmanData.folders[folderIndex].id
    });
    postmanData.folders[folderIndex].order.push(id);

    // Generate POST a new datapoint
    id = uuid.v4();
    postmanData.requests.push({
        "id": id,
        "headers": "Content-Type: application/json\n",
        "url": "http://localhost:8080/" + endpointName,
        "pathVariables": {},
        "preRequestScript": "",
        "method": "POST",
        "collectionId": postmanData.id,
        "data": [],
        "dataMode": "raw",
        "name": "Create new " + endpointName,
        "description": "",
        "descriptionFormat": "html",
        "time": new Date().getTime(),
        "version": 2,
        "responses": [],
        "tests": "",
        "currentHelper": "normal",
        "helperAttributes": {},
        "folder": postmanData.folders[folderIndex].id,
        "rawModeData": JSON.stringify(generateRawData(data[endpointName]), null, 4)
    });
    postmanData.folders[folderIndex].order.push(id);

    // Generate PUT a datapoint
    id = uuid.v4();
    postmanData.requests.push({
        "id": id,
        "headers": "Content-Type: application/json\n",
        "url": "http://localhost:8080/" + endpointName + "/:id",
        "pathVariables": {},
        "preRequestScript": "",
        "method": "PUT",
        "collectionId": postmanData.id,
        "data": [],
        "dataMode": "raw",
        "name": "Update a/an entire " + endpointName,
        "description": "",
        "descriptionFormat": "html",
        "time": new Date().getTime(),
        "version": 2,
        "responses": [],
        "tests": "",
        "currentHelper": "normal",
        "helperAttributes": {},
        "folder": postmanData.folders[folderIndex].id,
        "rawModeData": JSON.stringify(generateRawData(data[endpointName]), null, 4)
    });
    postmanData.folders[folderIndex].order.push(id);

    // Generate PATCH a datapoint
    id = uuid.v4();
    postmanData.requests.push({
        "id": id,
        "headers": "Content-Type: application/json\n",
        "url": "http://localhost:8080/" + endpointName + "/:id",
        "pathVariables": {},
        "preRequestScript": "",
        "method": "PATCH",
        "collectionId": postmanData.id,
        "data": [],
        "dataMode": "raw",
        "name": "Update part of a/an " + endpointName,
        "description": "",
        "descriptionFormat": "html",
        "time": new Date().getTime(),
        "version": 2,
        "responses": [],
        "tests": "",
        "currentHelper": "normal",
        "helperAttributes": {},
        "folder": postmanData.folders[folderIndex].id,
        "rawModeData": JSON.stringify(generateRawData(data[endpointName]), null, 4)
    });
    postmanData.folders[folderIndex].order.push(id);

    // Generate DELETE a datapoint
    id = uuid.v4();
    postmanData.requests.push({
        "id": id,
        "headers": "",
        "url": "http://localhost:8080/" + endpointName + "/:id",
        "pathVariables": {},
        "preRequestScript": "",
        "method": "DELETE",
        "collectionId": postmanData.id,
        "data": [],
        "dataMode": "raw",
        "name": "Delete a/an " + endpointName,
        "description": "",
        "descriptionFormat": "html",
        "time": new Date().getTime(),
        "version": 2,
        "responses": [],
        "tests": "",
        "currentHelper": "normal",
        "helperAttributes": {},
        "folder": postmanData.folders[folderIndex].id,
        "rawModeData": ""
    });
    postmanData.folders[folderIndex].order.push(id);
});

function findEndpointFolderIndex(endpointName, postmanData) {
    return postmanData.folders.findIndex((element) => {
        return element.name === endpointName;
    });
}

fs.writeFileSync("postmanOutput.json", JSON.stringify(postmanData, null, 4));