const Game = require("../Models/game.model")


exports.add_game = async (req, res) => {
    try {
        // Destructure the data from the request body
        const { gameImage, gameTitle, fees, maxPlayers, teamSize, gameDate, status, price } = req.body;
        // console.log(fees, gameImage)

        // Validate required fields
        if (!gameImage || !gameTitle || !fees || !maxPlayers || !teamSize || !gameDate || !price) {
            return res.status(401).json({ msg: 'All fields are required', success: false });
        }

        // Create a new game instance
        const newGame = new Game({
            gameImage,
            gameTitle,
            fees,
            maxPlayers,
            teamSize,
            gameDate,
            price,
            status: status || 1, // Use the provided status or default to 1
        });

        // Save the game to the database
        await newGame.save();

        // Respond with the created game
        return res.status(201).json({ msg: 'Game added successfully', success: true, newGame });
    } catch (error) {
        console.error('Error adding game:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};


exports.update_game = async (req, res) => {
    try {
        // Get the game ID from the request parameters
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(401).json({ msg: 'Game ID is required', success: false });
        }

        // Find the game by ID
        const game = await Game.findById(id);
        if (!game) {
            return res.status(404).json({ msg: 'Game not found', success: false });
        }

        // Check current status and update it
        const newStatus = game.status === 1 ? 0 : 1; // Toggle status between 0 and 1

        // Update the game status
        const updatedGame = await Game.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true, runValidators: true } // Return the updated document
        );

        // Respond with the updated game
        return res.status(200).json({ msg: 'Game status updated successfully', success: true, updatedGame });
    } catch (error) {
        console.error('Error updating game:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};


exports.get_game = async (req, res) => {
    try {
        // Fetch all games from the database
        const games = await Game.find();

        // Respond with the list of games
        return res.status(200).json({ msg: 'Games retrieved successfully', success: true, games });
    } catch (error) {
        console.error('Error retrieving games:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};

exports.get_game_by_id = async (req, res) => {
    try {
        // Extract the game ID from the request parameters
        const { id } = req.params;

        // Find the game by ID
        const game = await Game.findById(id);

        // If the game is not found, return a 404 error
        if (!game) {
            return res.status(404).json({ msg: 'Game not found', success: false });
        }

        // Respond with the found game
        return res.status(200).json({ msg: 'Game retrieved successfully', success: true, game });
    } catch (error) {
        console.error('Error retrieving game by ID:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};