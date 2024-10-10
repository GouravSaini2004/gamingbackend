const express = require("express")
const router = express.Router();
const{register, login, addTransaction, get_user, verify_email} = require("../Controllers/user.controller")

router.post('/register', register);
router.post('/login', login);
router.get('/get_user/:id', get_user);
router.patch('/update/:id', addTransaction)
router.get('/verify_email', verify_email)

module.exports = router;