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
            } else if (role === 'STUDENT') {
                const student = new Student({
                    name,
                    schoolId: req.body.schoolId
                });
                return student.save();
            } else {
                res.status(500).send(`"${role}" is not a valid role`);
            }
        })
        .then(entity => res.json(entity))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
