const Participant = require('../Models/player.model')


exports.add_player = async (req, res) => {
    try {
        // Destructure data from the request body
        const { email, phoneNumber, gameId, gameTitle, user } = req.body;

        // Validate required fields
        if (!email || !phoneNumber || !gameId || !gameTitle || !user) {
            return res.status(401).json({ msg: 'All fields are required', success: false });
        }

        // Create a new participant instance
        const newParticipant = new Participant({
            email,
            phoneNumber,
            gameId,
            gameTitle,
            user,
        });

        // Save the participant to the database
        await newParticipant.save();

        // Respond with the created participant
        return res.status(201).json({ msg: 'Participant added successfully', success: true, newParticipant });
    } catch (error) {
        console.error('Error adding participant:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};


exports.get_player = async (req, res) => {
    try {
        // Retrieve all participants from the database
        const participants = await Participant.find().populate('user'); // Populate user details if needed

        // Respond with the list of participants
        return res.status(200).json({participants, success: false});
    } catch (error) {
        console.error('Error retrieving participants:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};