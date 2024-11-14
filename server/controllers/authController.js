const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');



const test = (req, res) => {
  res.send('Hello World');
};



const registerUser = async (req, res) => {
  try {
    const{name,email,password} = req.body;
    //check if name was entered
    if(!name) {
      return res.json({
        error: 'Name is required'
      });
    }

    //check password is good
    if(!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long'
      });

    }

    //check email
    const exist = await User.findOne({email})
    if(exist) {
      return res.json({
        error: "Email is taken alredy"
      })
    }

    //hash password
    const hashedPassword = await hashPassword(password);




    // create user in database
    const user =await User.create({
      name,email,password: hashedPassword,
    })


    return res.json(user)

  } catch (error) {
    console.log(error)
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