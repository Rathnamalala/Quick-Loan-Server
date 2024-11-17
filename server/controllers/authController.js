const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');



const test = (req, res) => {
  res.send('Hello World');
};



const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, gender, email, mobile, dob, password } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !username || !gender || !email || !mobile || !dob) {
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

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already in use.' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const user = await User.create({
      first_name,
      last_name,
      username,
      gender,
      email,
      mobile,
      dob,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};





const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Verify the password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate a token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Send the token as a cookie and response
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
      .status(200)
      .json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

const logoutUser = (req, res) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie('token', {
      httpOnly: true, // Prevent access by JavaScript
      secure: true,   // Ensures cookie is sent only over HTTPS
      sameSite: 'strict', // Prevents CSRF
    })
      .status(200)
      .json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging out' });
  }
};

module.exports = { test, registerUser, loginUser, logoutUser };



