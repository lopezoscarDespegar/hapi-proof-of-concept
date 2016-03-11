"use strict";
const hotels = require("../lib/hotels.js");

var HotelCtrl = function(db){

    return {
        getHotels(params,cb){

        },

        getHotelById(params,cb){
            var filters = {
                "_id":1,
                "name":1,
                "template.id":1,
                "template.css":1,
                "template.path":1,
                "template.pictures.logoUrl":1,
                "general.domains.domain":1,
                "general.domains.online":1
            };

            hotels.getHotelById(params,filters,(err, hotelRaw) => {
                if(err)
                    return cb(err,null);

                try {
                    var url = "http://www."+hotelRaw.general.domains[0].domain;

                    var hotel = {
                        id: hotelRaw._id,
                        name:hotelRaw._id || "",
                        url:url,
                        demoUrl: "http://"+hotelRaw._id+".reservalia.com",
                        template: {
                            id: hotelRaw.template.id,
                            name: hotelRaw.template.path,
                            css: hotelRaw.template.css
                        },
                        domains: hotelRaw.general.domains,
                        logo: url.trim()+"/"+hotelRaw.template.pictures.logoUrl.trim()
                    };
                }catch(err){
                    return cb(err,null);
                }
                return cb(null,hotel);

            });
        }
    }
};

module.exports = new HotelCtrl(global.db);