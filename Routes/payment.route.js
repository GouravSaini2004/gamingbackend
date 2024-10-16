const express = require("express")
const router = express.Router();
const upload = require("../middleware/multer")
const {get_payment,add_payment} = require('../Controllers/payment.controller')

router.get('/get_payment', get_payment);
router.post('/add_payment',upload.single("image"), add_payment);

module.exports = router;