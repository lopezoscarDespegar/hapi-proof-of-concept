"use strict";

const Hapi = require("hapi");
const Good = require('good');

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');


const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path:'/api/v1/hotels',
    config:{
        handler: function (request, reply) {
            return reply([{id:331131}]);
        },
        plugins: {
            'hapi-swagger': {
                responses: {'400': {'description': 'Bad Request'},'200':{'description':'ok'}},
                payloadType: 'json'
            }
        },
        tags: ['api']
    }

});

const responseModel = Joi.object({
    id: Joi.number()
}).label('Result');

//Tiene que coincidir el path param con el params del objeto validate.
server.route({
    method: 'GET',
    path: '/api/v1/hotels/{hotelId}',
    handler: function (request, reply) {
        console.log(request.params);
        reply({id:331131});
    },
    config:{
        plugins: {
            'hapi-swagger': {
                responses: {'400': {'description': 'Bad Request'},'200':{'description':'ok'}},
                payloadType: 'json'
            }
        },
        tags: ['api'],
        validate: {
            params: {
                hotelId: Joi.number().required().description('Hotel ID form PAM')
            }
        },
        response: {schema: responseModel}
    }
});

const options = {
    info: {
        'title': 'Test API Documentation',
        'version': "v1.0.0"
    }
};

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    },
    {
        register: Good,
        options: {
            reporters: [{
                reporter: require('good-console'),
                events: {
                    response: '*',
                    log: '*'
                }
        }]
    }
}], (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});



