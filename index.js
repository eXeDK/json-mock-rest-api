'use strict';

var restify = require('restify');
var config = require('./config');

// Load in the data
var data = require(config.data);

var server = restify.createServer({
    name: 'GitAPI',
    version: '1.0.0'
});

// Pong
server.get('ping', (req, res, next) => {
    res.send('pong');
    return next();
});

// Loop through all endpoints
data.forEach((endpoint) => {
    // Create endpoint for getting all data in the endpoint
    server.get('/' + endpoint.name, (req, res, next) => {
        res.send(200, endpoint.data);
        return next();
    });

    // Create endpoint for getting a specific element in the endpoint
    server.get('/' + endpoint.name + '/:id', (req, res, next) => {
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

    server.post('/' + endpoint.name, (req, res, next) => {
        // Validate that data supplied was correct

        // Tell the developer if there was unexpected data

        // Add data to data and save
    });
});


server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
});