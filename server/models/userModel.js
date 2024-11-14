const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  dob: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registered_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
