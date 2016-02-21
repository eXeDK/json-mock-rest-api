'use strict';

var fs = require('fs');
var path = require('path');
var commandLineArgs = require('command-line-args');
var _ = require('underscore');
var restify = require('restify');
var uuid = require('uuid');
var validateInput = require('./validateInput');

// TODO: More validationRules
// TODO: More datatypes

// Parse parameters
var cli = commandLineArgs([
  {name: 'config', alias: 'c', type: String},
  {name: 'persist', alias: 'p', type: Boolean, defaultOption: true, defaultValue: true}
]);

var options = cli.parse();
if (!_.has(options, 'config') || options.config.length == 0) {
  console.log(cli.getUsage());
}

// Load in the data
var data = require(options.config);

var server = restify.createServer({
  name: 'JSON Mock REST API',
  version: '1.0.0'
});
server.use(restify.bodyParser());

// Pong
server.get('ping', (req, res, next) => {
  res.send('pong');
  return next();
});

// Loop through all endpoints
_.keys(data).forEach((endpointName) => {
  var endpoint = data[endpointName];
  if (typeof endpoint.data === 'undefined') {
    endpoint.data = []
  }

  // Create endpoint for getting all data in the endpoint
  server.get('/' + endpointName, (req, res, next) => {
    res.send(200, endpoint.data);
    return next();
  });

  // Create endpoint for getting a specific element in the endpoint
  server.get('/' + endpointName + '/:id', (req, res, next) => {
    var endPointElement = getElementById(req.params.id, endpoint.data);

    if (typeof endPointElement === 'undefined') {
      res.send(new restify.errors.NotFoundError('Data was not found'));
      return next();
    }

    res.send(200, endPointElement);
    return next();
  });

  // Create endpoint for POST
  server.post('/' + endpointName, validateInput(endpoint.validation),
    (req, res, next) => {
      if (typeof getElementById(req.body.id, endpoint.data) !== 'undefined') {
        res.send(new restify.errors.InvalidContentError('Id already exists'));
        return next();
      }

      var handledData = handleData(req.body, req.files);
      endpoint.data.push(handledData);

      res.send(201, handledData);
      return next();
      // Add data to data and save
    });

  // Create endpoint for PUT
  server.put('/' + endpointName + '/:id', validateInput(endpoint.validation),
    (req, res, next) => {
      var endPointElementKey = getElementKeyById(req.params.id, endpoint.data);

      if (typeof endPointElementKey === 'undefined') {
        res.send(new restify.errors.NotFoundError('Data was not found'));
        return next();
      }

      // Validation has been run, update the fields of the data
      endpoint.data[endPointElementKey] = req.body;

      res.send(204, req.body);
      return next();
    });

  // Create endpoint for PATCH
  server.patch('/' + endpointName + '/:id', validateInput(endpoint.validation),
    (req, res, next) => {
      var endPointElement = getElementById(req.params.id, endpoint.data);

      if (typeof endPointElement === 'undefined') {
        res.send(new restify.errors.NotFoundError('Data was not found'));
        return next();
      }

      // Validation has been run, update the fields of the data
      _.keys(endPointElement).forEach((key) => {
        endPointElement[key] = req.body[key];
      });

      res.send(204, endPointElement);
      return next();
    });

  // Create DELETE endpoint
  server.del('/' + endpointName + '/:id', (req, res, next) => {
    var endPointElement = getElementById(req.params.id, endpoint.data);

    if (typeof endPointElement === 'undefined') {
      res.send(new restify.errors.NotFoundError('Data was not found'));
      return next();
    }

    delete endpoint.data[req.params.id];

    res.send(204, {});
    return next();
  });

  server.on('after', (req) => {
    var alteringMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    if (options.persist && _.contains(alteringMethods, req.method)) {
      // We should persist the data
      fs.writeFileSync(
        options.config,
        'module.exports = ' + JSON.stringify(data, null, 2) + ";\n"
      );
    }
  });
});

function handleData(body, files) {
  var fileData = _.mapObject(files, function(data) {
    // Check if 'files' folder is present
    try {
      fs.accessSync('./files/', fs.F_OK);
      // Do something
    } catch (e) {
      // It isn't accessible
      fs.mkdirSync('./files/');
    }

    // Save file to disk
    var newFileName = uuid.v4() + path.extname(data.name);
    var source = fs.createReadStream(data.path);
    var dest = fs.createWriteStream(
      './files/' + newFileName
    );    source.pipe(dest);

    // Return file object
    return {
      name: newFileName,
      type: data.type,
      path: './files/' + newFileName
    }
  });
  return _.extend({}, body, fileData);
}

function getElementById(id, collection) {
  return collection.find((element) => {
    if (element.id == id) {
      return true;
    }
  });
}

function getElementKeyById(id, collection) {
  return collection.findIndex((element) => {
    if (element.id == id) {
      return true;
    }
  });
}

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
