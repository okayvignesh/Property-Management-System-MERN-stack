const mongoose = require("mongoose");
const servicesinfo = new mongoose.Schema({
    buildid:{
        type:String, 
        required:true
    },
    service: {
        type:String,
        required:true
    }
})
const services = new mongoose.model("Services",servicesinfo);
module.exports=services;
