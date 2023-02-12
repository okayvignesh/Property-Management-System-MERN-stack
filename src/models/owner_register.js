const mongoose = require("mongoose");
const pms = new mongoose.Schema({
    firstname :{
        type: String,
        required:true
    },
    lastname :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
})
const ownerRegister = new mongoose.model("ownerRegister",pms);
module.exports=ownerRegister;
