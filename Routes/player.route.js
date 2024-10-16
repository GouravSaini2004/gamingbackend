const express = require("express")
const router = express.Router();
const {add_player, get_players,get_player,update_player} = require('../Controllers/player.controller')

router.get('/get_players', get_players);
router.get('/get_player/:id', get_player);
router.post('/add_player', add_player);
router.patch('/update_player/:id', update_player);

module.exports = router;
