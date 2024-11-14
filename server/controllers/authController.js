const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');



const test = (req, res) => {
  res.send('Hello World');
};



const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, gender, email, mobileNumber, dateOfBirth, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !gender || !email || !mobileNumber || !dateOfBirth) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate password length
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = await User.create({
      firstName,
      lastName,
      gender,
      email,
      mobileNumber,
      dateOfBirth,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};





//loging endpoint
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    //check if email exist
    const user = await User.findOne({email});
    if(!user) {
        return res.json({error: 'Invalid credentials'});
      }
    // check password
    const match = await comparePassword(password, user.password);
    if(match) {
      jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET, {}, (err, token) => {
        if(err) throw err;
        res.cookie('token', token).json(user);
      });
    }
    if(!match) {
      return res.json({error: 'Invalid credentials'});
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { test, registerUser, loginUser };