const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    title:{
        reqiured:true,
        type:String
    },
    description:{
        type:String,
        required : true
    },
    address:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    creator:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    }
});

module.exports = mongoose.model("Place",PlaceSchema);