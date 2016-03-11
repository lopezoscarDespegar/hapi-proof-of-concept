"use strict";

module.exports = {

    getHotelConfigById(params,cb){
        db.config.findOne({_id: ""+params.hotelId},cb);
    }
};