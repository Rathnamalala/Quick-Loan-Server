const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const documentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  loan_id: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
  document_type: { type: String, required: true },
  document_url: { type: String, required: true },
  upload_date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
