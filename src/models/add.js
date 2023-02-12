const mongoose = require("mongoose");
const building = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    contact :{
        type:Number,
        required:true
    },

    buildingno :{
        type: String,
        required:true
    },
    street :{
        type:String,
        required:true
    },
    locality:{
        type:String,
        required:true,
    },
    slocality:{
        type:String
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    flats:{
        type:Number,
        required:true
    },
    buildimage:{
        type:Buffer,
        required:true,
        
    },
    buildid:{
        type:Number,
        unique:true
    },
    location:{
        type:String,
        required:true,
    }
    
})
const Build = new mongoose.model("buildings",building);
module.exports=Build;
