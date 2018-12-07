const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const { userTypes } = require('../constants');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, validate: validateRole }
});

function validateRole(value) {
    return Object.values(userTypes).includes(value);
}

userSchema.pre('save', function(next) {
    const user = this;
    if (this.isModified('password') == this.isNew) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(error);
                }
                user.password = hash;
                next();
            });
        })
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
