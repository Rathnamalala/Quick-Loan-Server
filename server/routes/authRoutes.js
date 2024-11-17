const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test,registerUser,loginUser,logoutUser } = require('../controllers/authController');




  router.get('/',test);
  router.post('/register',registerUser);
  router.post('/login',loginUser);
  router.post('/logout',logoutUser);



  module.exports = router;