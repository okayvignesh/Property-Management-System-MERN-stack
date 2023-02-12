const mongoose = require("mongoose");
const compinfo = new mongoose.Schema({
    buildid:{
        type:String, 
        required:true
    },
    name:{
        type:String,
        required:true
    },
    complaint:{
        type:String,
        required:true
    }

})
const complaints = new mongoose.model("complaints",compinfo);
module.exports=complaints;
