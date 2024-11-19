const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const documentRoutes = require('./routes/documentRoutes');
// Create express app
const app = express();

app.use(cors({
  origin: '*', // Allow all origins
  credentials: true // Include cookies or headers for authentication
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log("Database connection error", err));


//middleware
app.use(express.json());  
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));





app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/documents', documentRoutes);





const port = 8000;
app.listen(port, () => {console.log(`Server is running on port ${port}`)});

