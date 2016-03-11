"use strict";

const Hapi = require("hapi");

//Hapi Plugins
const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');


//Database Driver
const mongojs = require("mongojs");

global.db = mongojs("mongodb://localhost:27017/specialdom",["config"]);


const server = new Hapi.Server();

var hotels = require("./controllers/hotelCtrl.js");

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
            hotels.getHotels((err,hotels) => {
                if(err)
                    return reply(err);
                return reply(hotels);
            });
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

var plugins = {
    'hapi-swagger': {
        responses: {'400': {'description': 'Bad Request'},'200':{'description':'ok'}},
        payloadType: 'json'
    }
};

//Tiene que coincidir el path param con el params del objeto validate.
server.route({
    method: 'GET',
    path: '/api/v1/hotels/{hotelId}',
    config:{
        plugins: plugins,
        tags: ['api'],
        validate: {
            params: {
                hotelId: Joi.number().required().description('Hotel ID from PAM')
            },
            query:{
                reduce: Joi.boolean().description("Reduce version of Hotel")
            }
        }
        //response: {schema: responseModel}
    },
    handler: function (request, reply) {
        hotels.getHotelById(request.params,(err,hotel) => {
           if(err)
               return reply(err);
            return reply(hotel);
        });
    }
});

server.route({
    method:"GET",
    path:"/api/v1/sales/{from}/{to}",
    config:{
        plugins: plugins,
        tags: ['api'],
        validate:{
            params:{
                from: Joi.string().length(8).required().description("Fecha Desde YYYYMMDD (20160101)"),
                to: Joi.string().length(8).required().description("Fecha Hasta YYYYMMDD (20160229) ")
            }
        }
    },
    handler: function(req,res){
        res({sales:1});
    }
});
server.route({
    method:"GET",
    path:"/api/v1/sales/{hotelId}/{from}/{to}",
    config:{
        plugins: plugins,
        tags: ['api'],
        validate:{
            params:{
                hotelId:Joi.number().required().description("Hotel ID"),
                from: Joi.string().length(8).required().description("Fecha Desde YYYYMMDD (20160101)"),
                to: Joi.string().length(8).required().description("Fecha Hasta YYYYMMDD (20160229) ")
            }
        }
    },
    handler: function(req,res){
        res({sales:1});
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



