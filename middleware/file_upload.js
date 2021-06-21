const multer = require("multer")
const uuid = require("uuid")
const MIMETYPEMAP = {
    "image/png":"png",
    "image/jpeg":"jpeg",
    "image/jpg":"jpg",
}
const fileUpload = multer({
    limits:500000,
    storage: multer.diskStorage({
        destination:(req,file,callBack)=>{
            callBack(null,"uploads/images")
        },
        filename:(req,file,callBack)=>{
            const ext = MIMETYPEMAP[file.mimetype]
            callBack(null,uuid.v1()+'.'+ext) 
        }
    }),
    fileFilter:(req,file,callBack)=>{
        const isValid = !!MIMETYPEMAP[file.mimetype]
        let error = isValid?null:new Error ("Invalid MIMETYPE")
        callBack(error,isValid)
    }
})

module.exports = fileUpload