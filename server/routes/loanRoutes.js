const express = require('express');
const { 
    applyLoan,
    getLoanDetails,
    getUserLoans,
    updateLoan,
    deleteLoan 
} = require('../controllers/loanController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new loan application
router.post('/apply', authenticateUser, applyLoan);

// Read: Get details of a specific loan
router.get('/:loanId', authenticateUser, getLoanDetails);

// Read: Get all loans for a user
router.get('/', authenticateUser, getUserLoans);

// Update a loan (Eligibility status, suggested loan amount)
router.put('/:loanId', authenticateUser, updateLoan);

// Delete a loan
router.delete('/:loanId', authenticateUser, deleteLoan);

module.exports = router;
