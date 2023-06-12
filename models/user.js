const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isemail');
const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        require: true,
        validate: {
            validator: isEmail,
            message: "Invalid Email"
        },
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    tc: {
        type: Boolean,
        require: true
    }

});

const User = mongoose.model('user', userSchema);

module.exports = User;