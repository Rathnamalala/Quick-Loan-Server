const Loan = require('../models/loanModel');

// Create a Loan (Apply for Loan)
const applyLoan = async (req, res) => {
    try {
        const { personal_details, family_details, financial_details } = req.body;

        // Validate input fields
        if (!personal_details || !family_details || !financial_details) {
            return res.status(400).json({ error: 'All loan details are required.' });
        }

        // Create loan entry
        const loan = await Loan.create({
            user_id: req.user.id, // Assuming `req.user` contains authenticated user info
            personal_details,
            family_details,
            financial_details,
            eligibility_status: 'Pending', // Default value
            suggested_loan_amount: 0 // Placeholder, updated later by ML
        });

        res.status(201).json({ message: 'Loan application submitted successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting loan application' });
    }
};

// Get Loan Details (Read)
const getLoanDetails = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.loanId).populate('user_id', 'first_name last_name');
        if (!loan) return res.status(404).json({ error: 'Loan not found' });

        res.status(200).json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching loan details' });
    }
};

// Get All Loans for a User
const getUserLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ user_id: req.user.id }).sort({ application_date: -1 });
        res.status(200).json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user loans' });
    }
};

// Update Loan (Eligibility, Suggested Loan Amount, and other fields)
const updateLoan = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { eligibility_status, suggested_loan_amount, personal_details, family_details, financial_details } = req.body;

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ error: 'Loan not found' });

        // Update fields only if they are provided in the request body
        if (eligibility_status) loan.eligibility_status = eligibility_status;
        if (suggested_loan_amount) loan.suggested_loan_amount = suggested_loan_amount;

        if (personal_details) {
            loan.personal_details = { ...loan.personal_details, ...personal_details };  // Merge existing and updated details
        }

        if (family_details) {
            loan.family_details = { ...loan.family_details, ...family_details };  // Merge existing and updated details
        }

        if (financial_details) {
            loan.financial_details = { ...loan.financial_details, ...financial_details };  // Merge existing and updated details
        }

        await loan.save();
        res.status(200).json({ message: 'Loan updated successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating loan' });
    }
}
;

// Delete Loan
const deleteLoan = async (req, res) => {
    try {
        const { loanId } = req.params;

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ error: 'Loan not found' });

        await loan.remove();
        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting loan' });
    }
};

module.exports = {
    applyLoan,
    getLoanDetails,
    getUserLoans,
    updateLoan,
    deleteLoan,
};
