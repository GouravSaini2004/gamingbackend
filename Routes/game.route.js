const express = require("express")
const router = express.Router();
const {get_game, add_game, update_game, get_game_by_id} = require('../Controllers/game.controller')

router.get('/get_game', get_game);
router.post('/add_game', add_game);
router.patch('/update_game/:id', update_game);
router.get('/get_game/:id', get_game_by_id);

module.exports = router;