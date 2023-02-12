const mongoose = require("mongoose");
const pms = new mongoose.Schema({
    buildingid:{
        type:Number, 
    }
})
const logtable = new mongoose.model("logg",pms);
module.exports=logtable;