const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  document_type: {
    type: String,
    required: true
  },
  document_data: {
    type: Buffer, // Storing binary data
    required: true
  },
  file_name: {
    type: String, // Original file name
    required: true
  },
  file_size: {
    type: Number, // File size in bytes
    required: true
  },
  file_type: {
    type: String, // File type (e.g., pdf, jpeg)
    required: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);
