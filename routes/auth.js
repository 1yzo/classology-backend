const express = require('express');
const jwt = require('jwt-simple');
const passport = require('passport');

require('../passport')(passport);
const User = require('../models/user');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const secrets = require('../secrets');

const router = express.Router();

router.post('/signup', (req, res) => {
    const { email, password, name, role } = req.body;

    if (role === 'STUDENT') {
        if (!req.body.schoolId) {
            res.status(400).json('SchoolId is required for Students');
        }
    }

    const user = new User({
        email,
        password,
        role
    });
    user.save()
        .then(({ _id }) => {
            if (role === 'TEACHER') {
               const teacher = new Teacher({
                    userId: _id,
                    name
                });
               return teacher.save();
            }
            if (role === 'STUDENT') {
                const student = new Student({
                    userId: _id,
                    name,
                    schoolId: req.body.schoolId
                });
                return student.save();
            }
        })
        .then( entity => res.json('Success, user created!'))
        .catch(err => res.status(500).json(err));
});

router.get('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.status(404).json('User not found');
            } else {
                user.comparePassword(password, (err, isMatch) => {
                    if (isMatch && !err) {
                        const token = jwt.encode(user, secrets.secret);
                        res.json(`JWT ${token}`);
                    } else {
                        res.status(401).json('Authentication failed: Wrong password');
                    }
                });
            }
        })
        .catch(err => res.status(500).json(err));
});

router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { role, _id } = req.user;
    if (role === 'TEACHER') {
        Teacher.findOne({ userId: _id })
            .then(teacher => res.json(teacher))
            .catch(err => res.status(500).json(err));
    }
    if (role === 'STUDENT') {
        Student.findOne({ userId: _id })
            .then(student => res.json(student))
            .catch(err => res.status(500).json(err));
    }
});

module.exports = router;
