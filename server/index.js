const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log("Database connection error", err));


//middleware
app.use(express.json  ());  


// Create express app
const app = express();


app.use ('/', require('./routes/authRoutes'));





const port = 8000;
app.listen(port, () => {console.log(`Server is running on port ${port}`)});

