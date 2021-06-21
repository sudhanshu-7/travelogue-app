const uuid = require("uuid")
const bcrypt = require('bcryptjs')
const HttpError = require("../model/http-error")
const User = require("../model/user")
const jwt = require("jsonwebtoken")

const getUsers = async (req,res,next)=>{
    let users;
    try{
        users = await User.find({},"-password")
    }catch(err){
        const error = new HttpError("Can Not Connect to the DB try again later",500)
        return next(error)
    }
    res.json({users:users.map(u => u.toObject({getters:true}))})
}
const signup = async (req,res,next)=>{
    const {username,email,password} = req.body
    let existing;
    try{
        existing = await User.findOne({email})
    }catch(err){
        console.log(err);
        const error = new HttpError("Something Went Wrong,Please Try Later",500)
        return next(error)
    }
    if(existing){
        const error = new HttpError("User Exists Already,LogIn Instead",422)
        return next(error)
    }
    let hashedPassword
    try{
        hashedPassword= await bcrypt.hash(password,12)
    }catch(e){
        const err = new HttpError("Could Not Create User!",500)
        return next(err)
    }
    const u = new User({
        name:username,
        email,
        image:req.file.path,
        password:hashedPassword,
        places:[]
        })
    try{
        await u.save()
    }
    catch(err){
        console.log(err,u);
        const error = new HttpError("SignUp Failed",500)
        return next(error)
    }
    let token
    try{
        token = jwt.sign({userId:u.id,email:u.email},process.env.JWT_KEY,{expiresIn:"1h"})
    }catch(err){
        console.log(err,u);
        const error = new HttpError("SignUp Failed",500)
        return next(error)
    }
    res.status(201).json({message:"Sign UP sucessfull",userId:u.id,email:u.email,token:token})
}
const login = async(req,res,next)=>{
    const {email,password} = req.body;
    let existing;
    try{
        existing = await User.findOne({email})
    }catch(err){
        const error = new HttpError("Login Failed",500)
        return next(error)
    }
    if(!existing){
        const error = new HttpError("Invalid Credentials",401)
        return next(error)
    }
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password,existing.password)
    }catch(err){
        const error = new HttpError("Could Not Log You In!Please Try Again",500)
        return next(error)
    }
    if(!isValidPassword){
        return next(new HttpError("Invalid Credentials",404))
    }
    let token 
    try{
        token = jwt.sign({userId:existing.id,email:existing.email},process.env.JWT_KEY,{expiresIn:"1h"})
    }catch(err){
        console.log(err);
        const error = new HttpError("SignUp Failed",500)
        return next(error)
    }
    res.json({message:"Logged IN",userId:existing.id,email:existing.email,token})
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login