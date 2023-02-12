const mongoose = require("mongoose");
const paymentinfo = new mongoose.Schema({
    cardholder:{
        type:String, 
        required:true
    },
    cardnumber:{
        type:Number,
        required:true
    }
})
const payinfo = new mongoose.model("payment",paymentinfo);
module.exports=payinfo;
