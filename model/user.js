const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator")

const User = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    image:{
        type:String,
        required:true
    },
    places:[
        {
            type:mongoose.Types.ObjectId,
            required:true,
            ref:"Place"
        }
    ]
})
User.plugin(uniqueValidator)

module.exports = mongoose.model("User",User)