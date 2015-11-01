'use strict';

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
        var endPointElement = endpoint.data.find((element) => {
            if (element.id == req.params.id) {
                return element;
            }
        });

        if (typeof endPointElement === 'undefined') {
            res.send(new restify.errors.NotFoundError('Data was not found'));
            return next();
        }

        res.send(200, endPointElement);
        return next();
    });

    server.post('/' + endpointName, validateInput(endpoint.validation), (req, res, next) => {
        if (config.persist) {
            // We should persist the data
        }

        res.send(201, req.body);
        return next();
        // Add data to data and save
    });
});


server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
});