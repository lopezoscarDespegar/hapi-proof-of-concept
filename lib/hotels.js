"use strict";

module.exports = {
    getHotels(cb){
        db.config.find({},cb);
    },
    getHotelById(params,filters,cb){
        db.config.findOne({ _id: ""+params.hotelId},filters,cb);
    }
};
