'use strict';

var fs = require('fs');
var _ = require('underscore');
var restify = require('restify');
var config = require('./config');
var validateInput = require('./validateInput');

// Load in the data
var data = require(config.data);

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

      endpoint.data.push(req.body);

      res.send(201, req.body);
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

  server.on('after', (req, res, route) => {
    if (config.persist) {
      // We should persist the data
      console.log(res, route);
      console.log('Current data: ', JSON.stringify(data, null, 2));
      fs.writeFileSync(config.data, JSON.stringify(data, null, 2));
    }
  });
});

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
