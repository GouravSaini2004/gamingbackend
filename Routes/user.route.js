const express = require("express")
const router = express.Router();
const{register, login, addTransaction, get_user, verify_email,generate_password,verify_otp,send_otp} = require("../Controllers/user.controller")

router.post('/register', register);
router.post('/login', login);
router.get('/get_user/:id', get_user);
router.patch('/update/:id', addTransaction)
router.get('/verify_email', verify_email)
router.post('/send_otp', send_otp)
router.post('/verify_otp', verify_otp)
router.post('/generate_password', generate_password)

module.exports = router;