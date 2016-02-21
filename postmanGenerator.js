'use strict';

var fs = require('fs');

var _ = require('underscore');
var uuid = require('uuid');
var faker = require('faker');
var commandLineArgs = require('command-line-args');

var generateRawData = require('./common/generateRawData');
var generateMultipartData = require('./common/generateMultipartData');

var cli = commandLineArgs([
  {name: 'config', alias: 'i', type: String},
  {name: 'debug', alias: 'd', type: Boolean, defaultOption: false}
]);

var options = cli.parse();

if (!_.has(options, 'config') || options.config.length == 0) {
  console.log(cli.getUsage());
}

// Load in the data
var data = require(options.config);
var postmanData = {
  id: uuid.v4(),
  name: 'Generated Postman Collection',
  order: [],
  folders: [],
  timestamp: 0,
  owner: null,
  remoteLink: null,
  public: false,
  requests: []
};

_.keys(data).forEach((endpointName) => {
  postmanData.folders.push({
    id: uuid.v4(),
    name: endpointName,
    description: '',
    order: [],
    owner: null
  });
  var folderIndex = findEndpointFolderIndex(endpointName, postmanData);

  // Generate GET all requests
  var id = uuid.v4();
  postmanData.requests.push({
    id: id,
    headers: '',
    url: 'http://localhost:8080/' + endpointName,
    pathVariables: {},
    preRequestScript: '',
    method: 'GET',
    collectionId: postmanData.id,
    data: [],
    dataMode: 'params',
    name: 'Get all ' + endpointName,
    description: '',
    descriptionFormat: 'html',
    time: new Date().getTime(),
    version: 2,
    responses: [],
    tests: '',
    currentHelper: 'normal',
    helperAttributes: {},
    folder: postmanData.folders[folderIndex].id
  });
  postmanData.folders[folderIndex].order.push(id);

  // Generate GET specific datapoint request
  id = uuid.v4();
  postmanData.requests.push({
    id: id,
    headers: '',
    url: 'http://localhost:8080/' + endpointName + '/:id',
    pathVariables: {},
    preRequestScript: '',
    method: 'GET',
    collectionId: postmanData.id,
    data: [],
    dataMode: 'params',
    name: 'Get specific ' + endpointName,
    description: '',
    descriptionFormat: 'html',
    time: new Date().getTime(),
    version: 2,
    responses: [],
    tests: '',
    currentHelper: 'normal',
    helperAttributes: {},
    folder: postmanData.folders[folderIndex].id
  });
  postmanData.folders[folderIndex].order.push(id);

  // Generate POST a new datapoint
  id = uuid.v4();
  // Check if this endpoints contains files so we need to send a multipart
  // request
  if (endpointHasFile(data[endpointName])) {
    postmanData.requests.push({
      id: id,
      headers: 'Content-Type: application/json\n',
      url: 'http://localhost:8080/' + endpointName,
      pathVariables: {},
      preRequestScript: '',
      method: 'POST',
      collectionId: postmanData.id,
      data: generateMultipartData(data[endpointName]),
      dataMode: 'params',
      name: 'Create new ' + endpointName,
      description: '',
      descriptionFormat: 'html',
      time: new Date().getTime(),
      version: 2,
      responses: [],
      tests: '',
      currentHelper: 'normal',
      helperAttributes: {},
      folder: postmanData.folders[folderIndex].id
    });
  } else {
    postmanData.requests.push({
      id: id,
      headers: 'Content-Type: application/json\n',
      url: 'http://localhost:8080/' + endpointName,
      pathVariables: {},
      preRequestScript: '',
      method: 'POST',
      collectionId: postmanData.id,
      data: [],
      dataMode: 'raw',
      name: 'Create new ' + endpointName,
      description: '',
      descriptionFormat: 'html',
      time: new Date().getTime(),
      version: 2,
      responses: [],
      tests: '',
      currentHelper: 'normal',
      helperAttributes: {},
      folder: postmanData.folders[folderIndex].id,
      rawModeData: JSON.stringify(generateRawData(data[endpointName]), null, 4)
    });
  }
  postmanData.folders[folderIndex].order.push(id);

  // Generate PUT a datapoint
  id = uuid.v4();
  if (endpointHasFile(data[endpointName])) {
    postmanData.requests.push({
      id: id,
      headers: 'Content-Type: application/json\n',
      url: 'http://localhost:8080/' + endpointName + '/:id',
      pathVariables: {},
      preRequestScript: '',
      method: 'PUT',
      collectionId: postmanData.id,
      data: generateMultipartData(data[endpointName]),
      dataMode: 'params',
      name: 'Update a/an entire ' + endpointName,
      description: '',
      descriptionFormat: 'html',
      time: new Date().getTime(),
      version: 2,
      responses: [],
      tests: '',
      currentHelper: 'normal',
      helperAttributes: {},
      folder: postmanData.folders[folderIndex].id
    });
  } else {
    postmanData.requests.push({
      id: id,
      headers: 'Content-Type: application/json\n',
      url: 'http://localhost:8080/' + endpointName + '/:id',
      pathVariables: {},
      preRequestScript: '',
      method: 'PUT',
      collectionId: postmanData.id,
      data: generateMultipartData(data[endpointName]),
      dataMode: 'raw',
      name: 'Update a/an entire ' + endpointName,
      description: '',
      descriptionFormat: 'html',
      time: new Date().getTime(),
      version: 2,
      responses: [],
      tests: '',
      currentHelper: 'normal',
      helperAttributes: {},
      folder: postmanData.folders[folderIndex].id
    });
  }
  postmanData.folders[folderIndex].order.push(id);

  // Generate PATCH a datapoint
  id = uuid.v4();
  if (endpointHasFile(data[endpointName])) {
    postmanData.requests.push({
      id: id,
      headers: 'Content-Type: application/json\n',
      url: 'http://localhost:8080/' + endpointName + '/:id',
      pathVariables: {},
      preRequestScript: '',
      method: 'PATCH',
      collectionId: postmanData.id,
      data: generateMultipartData(data[endpointName]),
      dataMode: 'params',
      name: 'Update part of a/an ' + endpointName,
      description: '',
      descriptionFormat: 'html',
      time: new Date().getTime(),
      version: 2,
      responses: [],
      tests: '',
      currentHelper: 'normal',
      helperAttributes: {},
      folder: postmanData.folders[folderIndex].id
    });
  } else {
    postmanData.requests.push({
      id: id,
      headers: 'Content-Type: application/json\n',
      url: 'http://localhost:8080/' + endpointName + '/:id',
      pathVariables: {},
      preRequestScript: '',
      method: 'PATCH',
      collectionId: postmanData.id,
      data: [],
      dataMode: 'raw',
      name: 'Update part of a/an ' + endpointName,
      description: '',
      descriptionFormat: 'html',
      time: new Date().getTime(),
      version: 2,
      responses: [],
      tests: '',
      currentHelper: 'normal',
      helperAttributes: {},
      folder: postmanData.folders[folderIndex].id,
      rawModeData: JSON.stringify(generateRawData(data[endpointName]), null, 4)
    });
  }
  postmanData.folders[folderIndex].order.push(id);

  // Generate DELETE a datapoint
  id = uuid.v4();
  postmanData.requests.push({
    id: id,
    headers: '',
    url: 'http://localhost:8080/' + endpointName + '/:id',
    pathVariables: {},
    preRequestScript: '',
    method: 'DELETE',
    collectionId: postmanData.id,
    data: [],
    dataMode: 'raw',
    name: 'Delete a/an ' + endpointName,
    description: '',
    descriptionFormat: 'html',
    time: new Date().getTime(),
    version: 2,
    responses: [],
    tests: '',
    currentHelper: 'normal',
    helperAttributes: {},
    folder: postmanData.folders[folderIndex].id,
    rawModeData: ''
  });
  postmanData.folders[folderIndex].order.push(id);
});

function findEndpointFolderIndex(endpointName, postmanData) {
  return postmanData.folders.findIndex((element) => {
    return element.name === endpointName;
  });
}

function endpointHasFile(endpoint) {
  if (_.has(endpoint, 'generation')) {
   return specificEndpointHasFile(endpoint.generation);
  } else if (_.has(endpoint, 'validation')) {
    return specificEndpointHasFile(endpoint.validation);
  } else if (_.has(endpoint, 'data') && endpoint.data.length > 0) {
    return specificEndpointHasFile(endpoint.data);
  }
}

function specificEndpointHasFile(endpoint) {
  return -1 < _.values(endpoint).findIndex((element) => {
      return element === 'file' ||
        (typeof element == 'object' && _.has(element, 'type') &&
        element['type'] === 'file')
    });
}

fs.writeFileSync('postmanOutput.json', JSON.stringify(postmanData, null, 4));
