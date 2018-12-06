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
        .then(() => {
            if (role === 'TEACHER') {
               const teacher = new Teacher({ name });
               return teacher.save();
            }
            if (role === 'STUDENT') {
                const student = new Student({
                    name,
                    schoolId: req.body.schoolId
                });
                return student.save();
            }
        })
        .then( entity => res.json('Success, user created!'))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
