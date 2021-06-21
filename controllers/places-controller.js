const uuid = require("uuid")
const fs = require("fs")
const HttpError = require("../model/http-error")
const Place = require("../model/place")
const User = require("../model/user")
const mongoose = require("mongoose")

const getPlaceByID = async (req,res,next)=>{
    let place;
    try{
         place = await Place.findById(req.params.pid)
    }catch(err){
        const error = new HttpError("Something Gone Wrong!,Not Found",500);
        return next(error)
    }
    if(!place){
        const error = new HttpError("Not Found item for the given ID",404);
        return next(error)
    }
    res.json({place:place.toObject({getters:true})})
}
const getPlacesByUserID = async (req,res,next)=>{
    let places ;
    try{
         places = await Place.find({creator:req.params.uid})
    }catch(err){
        const error  = new HttpError("Unable To find from the dataBase",500)
        return next(error)
    }
    if(!places || places.length === 0){
        const error = new HttpError("No Places found for User ID",404);
        return next(error)
    }
    res.json({place:places.map(place=>place.toObject({getters:true}))});
}
const createPlace = async (req,res,next)=>{
    const {title,description,address,creator} = req.body
    const place = new Place({
        title,
        description,
        address,
        creator,
        image :req.file.path,
    })
    let user;
    try{
        user = await User.findById(creator)
    }catch(err){
        const error = new HttpError("Failed ,please try again later",500)
        return next(error);
    }
    if(!user){
        const error = new HttpError("No User for the given UserID",404)
        return next(error);
    }

    try{
        const session = await mongoose.startSession()
        session.startTransaction()
        await place.save({session})
        user.places.push(place)
        await user.save({session})
        await session.commitTransaction()

    }catch(err){
        const error = new HttpError("Unable To Save The Place",500);
        return next(error)
    }
    res.status(201).json({place})

}
const updatePlaceByID = async (req,res,next)=>{
    const {title,description} = req.body
    const pid = req.params.pid
    let place ;
    try{
        place = await Place.findById(pid)
    }catch(err){
        error = new HttpError("Cannot Update The Database",500)
        return next(error)
    }
    if(place.creator.toString() != req.userData.userId){
        error = new HttpError("Not Allowed to Edit this Place",401)
        return next(error)
    }
    place.title = title
    place.description = description
    try{
        await place.save();
    }catch(err){
        error = new HttpError("Cannot Save the Update The Database",500)
        return next(error)
    }
    res.status(200).json({
        message:"Update Succesfull",
        data:place.toObject({getters:true})
    })
}
const deletePlace = async (req,res,next)=>{
    const id = req.params.pid
    let place;
    try{
        place = await Place.findById(id).populate("creator")
    }catch(err){
        const error = new HttpError("Something Went Wrong! Could not delete place",500)
        return next(error)
    }
    if(!place){
        const error = new HttpError("Could Not Find Place",404)
        return next(error)
    }
    const PlacePath = place.image
    if(place.creator.id != req.userData.userId){
        error = new HttpError("Not Allowed to Delete this Place",401)
        return next(error)
    }
    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await place.remove({session:sess})
        place.creator.places.pull(place);
        await place.creator.save({session:sess})
        await sess.commitTransaction()
    }catch(err){
        console.log(err);
        const error = new HttpError("Something Went Wrong! Unable to delete place",500)
        return next(error)
    }
    fs.unlink(PlacePath,(err)=>console.log(err))
    res.status(200).json({message:"Deleted"})
}
exports.getPlaceByID = getPlaceByID
exports.getPlacesByUserID = getPlacesByUserID
exports.createPlace = createPlace
exports.deletePlace = deletePlace
exports.updatePlaceByID = updatePlaceByID