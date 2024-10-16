const Participant = require('../Models/player.model')
const mongoose = require('mongoose');
const User = require('../Models/user.model')


exports.add_player = async (req, res) => {
    try {
        // Destructure data from the request body
        const { email, phoneNumber, gameId, gameTitle, user } = req.body;
        console.log(req.body)

        // Validate required fields
        if (!email || !phoneNumber || !gameId || !gameTitle || !user) {
            return res.status(401).json({ msg: 'All fields are required', success: false });
        }
        const userData = await User.findOne({ email });


        if (!userData) {
            return res.status(401).json({ msg: 'User not found', success: false });
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


exports.get_players = async (req, res) => {
    try {
        // Retrieve all participants from the database
        const participants = await Participant.find().populate('user'); // Populate user details if needed

        // Respond with the list of participants
        return res.status(200).json({ participants, success: true });
    } catch (error) {
        console.error('Error retrieving participants:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};

exports.get_player = async (req, res) => {
    const id = req.params.id;
    try {
        // Retrieve all participants from the database
        const participants = await Participant.find({ user: new mongoose.Types.ObjectId(id) }).populate('user'); // Use 'new' here

        // Respond with the list of participants
        return res.status(200).json({ participants, success: true });
    } catch (error) {
        console.error('Error retrieving participants:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};

exports.update_player = async (req, res) => {
    const id = req.params.id;
    const {status} = req.body;
    // console.log(newStatus,id)
    try {
        // Retrieve all participants from the database
        const participant = await Participant.findById(id); // Use 'new' here
        if (!participant) {
            return res.status(401).json({ msg: 'Participant not found', success: false });
        }
         
        participant.status = status;
        await participant.save();

        // Respond with the list of participants
        return res.status(200).json({ msg:"Status Update Successfully", success: true });
    } catch (error) {
        console.error('Error retrieving participants:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};