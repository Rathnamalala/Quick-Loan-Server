const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const loanSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  personal_details: {
    full_name: { type: String, required: true },
    nic: { type: String, required: true },
    title: { type: String, required: true },
    home_town: { type: String, required: true },
    residential_address: { type: String, required: true },
    tax_payable: { type: Boolean, required: true }
  },
  family_details: {
    dependents: { type: Number, required: true }
  },
  financial_details: {
    employment_type: { type: String, required: true },
    basic_salary: { type: Number, required: true },
    occupation: { type: String, required: true },
    other_income: { type: Number, default: 0 }
  },
  eligibility_status: { type: String, required: true },
  suggested_loan_amount: { type: Number, required: true },
  application_date: { type: Date, default: Date.now }
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
