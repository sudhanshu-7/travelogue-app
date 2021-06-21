const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const fs = require("fs")
const path = require ("path")
require("dotenv").config()

const placesRoutes = require("./routes/places-routes")
const usersRoutes = require("./routes/users-routes")
const HttpError = require("./model/http-error")

const app = express()

app.use(bodyParser.json())
// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     res.setHeader("Access-Control-Allow-Methods",'GET, POST, PATCH, DELETE')
//     next()
// });
app.use('/uploads/images',express.static(path.join('uploads','images')))
app.use(express.static(path.join('build')))
app.use('/api/places',placesRoutes)
app.use('/api/users',usersRoutes)
// app.use((req,res,next)=>{
//     const error= new HttpError("Could Not Find this",404)
//     next(error)
// })
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,"build","index.html"))
})
app.use((err, req,res ,next)=>{
    if(req.file){
        fs.unlink(req.file.path,(err)=>{console.log("UNLINK",err)})
    }
    if(res.headerSent){
        return next(err)
    }
    res.status(err.code || 500).json({
        message:err.message||"Unknown Error Occured"
    })

})
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cnm4a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    
    app.listen(process.env.PORT ||  5000,()=>console.log("Console Working"))
}).catch(err=>{
    console.log(err);
})