const express = require("express")

const HttpError = require("../model/http-error")
const PlaceController = require("../controllers/places-controller")
const fileUpload = require('../middleware/file_upload')
const check_auth = require("../middleware/check_auth")

const router = express.Router()



router.get("/:pid",PlaceController.getPlaceByID)
router.get("/user/:uid",PlaceController.getPlacesByUserID)
router.use(check_auth)
router.post('/',fileUpload.single("image"),PlaceController.createPlace)
router.patch("/:pid",PlaceController.updatePlaceByID)
router.delete("/:pid",PlaceController.deletePlace)

module.exports = router