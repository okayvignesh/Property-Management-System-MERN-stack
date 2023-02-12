const mongoose = require("mongoose");
const buildinginfo = new mongoose.Schema({
    buildid:{
        type:String, 
        required:true
    },
    flatno:{
        type:String,
        required:true
    },
    Rooms:{
        type:String,
        required:true
    },
    Rent:{
        type:Number,
        required:true
    }

})
const Buildinfo = new mongoose.model("buildinginfo",buildinginfo);
module.exports=Buildinfo;
