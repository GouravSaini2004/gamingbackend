const Text = require("../Models/text.model")
const cloudinary = require("../Helpers/cloudinary")
const fs = require("fs")


exports.add_payment = async (req, res) => {
    try {
        // Destructure data from the request body
        const {  gameId } = req.body;
        // console.log(req.file,gameId);

        // Validate required fields
        if (!gameId) {
            return res.status(401).json({ msg: 'All fields are required', success: false });
        }

        if (!req.file) {
            return res.status(401).json({ msg: 'Image is required', success: false });
        }
        const result = await cloudinary.uploader.upload(req.file.path,{
            folder : "uploads",
            public_id: `${Date.now()}_${req.file.originalname}`,
        });
        if (!result) {
            return res.status(401).json({ msg: 'Image upload failed', success: false });
        }

        // Create a new participant instance
        const text = new Text({
            gameId,
            url : result.url
           
        });

        // Save the participant to the database
        await text.save();

        fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            }
          });

        // Respond with the created participant
        return res.status(201).json({ msg: 'Payment successful', success: true });
    } catch (error) {
        console.error('Error adding participant:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};

exports.get_payment = async (req, res) => {
    try {
        // Retrieve all participants from the database
        const Payment = await Text.find(); // Populate user details if needed

        if (!Payment) {
            return res.status(401).json({ msg: 'No Payment found', success: false });
        }

        if(Payment.length === 0){
            return res.status(401).json({ msg: 'No Payment found', success: false });
        }

        // Respond with the list of participants
        return res.status(200).json({ Payment, success: true });
    } catch (error) {
        console.error('Error retrieving Payments:', error);
        return res.status(500).json({ msg: 'Server error', success: false });
    }
};