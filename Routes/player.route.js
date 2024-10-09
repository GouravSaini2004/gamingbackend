const express = require("express")
const router = express.Router();
const {add_player, get_player} = require('../Controllers/player.controller')

router.get('/get_player', get_player);
router.post('/add_player', add_player);

module.exports = router;
