const express = require("express")

const HttpError = require("../model/http-error")
const UsersController = require("../controllers/users-controller")

const router = express.Router()
const fileUpload = require('../middleware/file_upload')


router.get("/",UsersController.getUsers)
router.post('/signup',fileUpload.single('image'),UsersController.signup)
router.post('/login',UsersController.login)


module.exports = router