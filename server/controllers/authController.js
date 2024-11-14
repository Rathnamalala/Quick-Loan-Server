const User = require('../models/userModel')


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

    const user =await User.create([
      name,email,password
    ])


    return res.json(user)

  } catch (error) {
    console.log(error)
  }
};







module.exports = { test, registerUser };