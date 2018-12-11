const express = require('express');
const router = express.Router();

const Class = require('../models/class');
const Teacher = require('../models/teacher');

router.post('/', async (req, res) => {
    const { teacher, name, description } = req.body;
    const newClass = new Class({
        teacher,
        name,
        description
    });
    try {
        const { id } = await newClass.save();
        await Teacher.findOneAndUpdate({ _id: teacher }, { $push: { classes: id } });
        res.json('Success, class created!');
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Class.findById(id)
        .then(payload => {
            if (!payload) {
                res.status(404).json('Class not found');
            } else {
                res.json(payload);
            }
        })
        .catch(err => res.status(500).json(err));
});



module.exports = router;
