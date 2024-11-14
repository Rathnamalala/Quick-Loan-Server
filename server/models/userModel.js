const e = require('express');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {type: String},
    email: {type: String, required: true},
    password: {type: String}
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;