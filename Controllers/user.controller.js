const User = require("../Models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require("../Helpers/nodemailer")
const dotenv = require('dotenv');
dotenv.config();


exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Name, email, and password are required.", success: false });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ msg: "User already exists. please login.", success: false });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const jwttoken = jwt.sign(
            { name, email, hashedPassword }, // Payload
            process.env.JWT_SECRET, 
        );
        // req.token = jwttoken;
        const verificationLink = `https://gamingbackend-dkf6.onrender.com/user/verify_email?token=${jwttoken}`
        const mailOptions = {
            from: "gamekarao82@gmail.com",
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: ${verificationLink}`,
        };

        await transporter.sendMail(mailOptions);

        // Send a success response
        return res.status(201).json({ msg: "Email sent successfully!", success: true});
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ msg: "Server error. Please try again.", success: false });
    }
};

exports.verify_email = async(req, res)=>{
    const { token } = req.query;
    // console.log(req.token);

    if (!token) {
        return res.send('<p style="color: blue; font-size: 30px;">Invalid token. Please try again.</p>');
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const email = decoded.email
        const name = decoded.name
        const password = decoded.hashedPassword

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send('<p style="color: blue; font-size: 30px;">Your email verifyed. Go on website and login!</p>');
        }
        //  Create a new user
         const newUser = new User({
            name,
            email,
            password // Store the hashed password
        });

        // Save the user to the database
        await newUser.save();
        // const { password: newUserPassword, transactionHistory, ...userWithoutSensitiveData } = newUser.toObject();
        // const redirectUrl = `https://gamekarao.vercel.app/login`;
        // return res.send('<p style="color: blue; font-size: 30px;">Email verifyed. Go back on website and Login!</p>');
        return res.redirect('https://gamekarao.onrender.com/#/login');
    } catch (error) {
        return res.status(500).json({ msg: "Server error. Please try again.", success: false });
    }

}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required.", success: false });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid email or password.", success: false });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password.", success: false });
        }

        // Optionally, you can generate a token here (e.g., using JWT)
        // const token = generateToken(user); // Implement token generation if needed

        // Send a success response
        const { password: userPassword, transactionHistory, ...userWithoutSensitiveData } = user.toObject();
        return res.status(200).json({ msg: "Login successful!", success: true, userWithoutSensitiveData });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

exports.addTransaction = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters
        const { transactionId, amount } = req.body; // Extract transaction details from request body

        // Validate that transactionId and amount are present
        if (!transactionId || !amount) {
            return res.status(401).json({ msg: "Transaction ID and amount are required", success: false });
        }

        // Find the user by ID and update the transaction history
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { transactionHistory: { transactionId, amount } } },
            { new: true, useFindAndModify: false } // Return the updated user
        );

        if (!user) {
            return res.status(404).json({ msg: "User not found" , success: false});
        }
        const { password: userPassword, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ msg: "Transaction added", userWithoutPassword, success:true });
    } catch (error) {
        res.status(401).json({ msg: "server erroe try again", success: false });
    }
};

exports.get_user = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    // console.log(userId)
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(401).json({ msg: "User not found", success: false });
        }

        // Create a copy of the user object without the password
        const { password, ...userWithoutPassword } = user.toObject();

        // Send the user data without the password
        res.status(200).json({ msg: "User fetched successfully", success: true, userWithoutPassword });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Server error. Please try again.", success: false });
    }
};
;

exports.send_otp = async (req, res) => {
    const { email } = req.body;
    // console.log(email,req.body)
    if (!email) {
        return res.status(401).json({ msg: "Email is required.", success: false });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "User not found.", success: false });
        }
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a JWT token that stores the OTP and email
        const jwttoken = jwt.sign(
            { email, otp }, // Payload containing the email and OTP
            process.env.JWT_SECRET, // Replace with your secret key
            { expiresIn: '10m' } // Token expires in 10 minutes
        );

        // Email content
        const mailOptions = {
            from: "gamekarao82@gmail.com",
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`
        };

        // Send OTP via email
        await transporter.sendMail(mailOptions);

        // Send success response along with the JWT token
        return res.status(200).json({
            msg: "OTP sent successfully!",
            success: true,
            token: jwttoken // This token can be used later for verifying OTP
        });

    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ msg: "Server error. Please try again.", success: false });
    }
};

exports.verify_otp = async (req, res) => {
    const { token, userOtp } = req.body; // The token and OTP from the client

    if (!token || !userOtp) {
        return res.status(401).json({ msg: "Token and OTP are required.", success: false });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
        const { email, otp } = decoded;

        // Compare the OTP from the token with the OTP provided by the user
        if (otp === userOtp) {
            return res.status(200).json({ msg: "OTP verified successfully!", success: true });
        } else {
            return res.status(400).json({ msg: "Invalid OTP.", success: false });
        }
    } catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token.", success: false });
    }
};


exports.generate_password = async (req, res) => {
    const { email, newPassword } = req.body;

    // Validate the input
    if (!email || !newPassword) {
        return res.status(401).json({ msg: "Email and new password are required.", success: false });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "User not found.", success: false });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        // Send a success response
        return res.status(200).json({ msg: "Password updated successfully!", success: true });
        
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ msg: "Server error. Please try again.", success: false });
    }
};
