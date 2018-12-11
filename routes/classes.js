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

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    Class.findOneAndUpdate({ _id: id }, { ...updates })
        .then(payloadClass => {
            if (payloadClass) {
                res.json('Success, class updated!');
            } else {
                res.status(404).json('Class not found');
            }
        })
        .catch(err => res.status(500).json(err));
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { teacher } = await Class.findOneAndDelete({ _id: id });
        await Teacher.findOneAndUpdate({ _id: teacher }, { $pull: { classes: id } });
        res.json('Success, class deleted!');
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id/students', (req, res) => {
    const { id } = req.params;
    Class.findOne({ _id: id })
        .populate('students')
        .then(({ students }) => {
            res.json(students);
        })
        .catch(err => res.status(500).json(err));
});

router.put('/:classId/students', (req, res) => {
    const { classId } = req.params;
    const { student } = req.body;
    Class.findOneAndUpdate({ _id: classId }, { $push: { students: student } })
        .then(() => res.json('Success, student added to class!'))
        .catch(err => res.status(500).json(err));
});

router.delete('/:classId/students/:studentId', (req, res) => {
    const { classId, studentId } = req.params;
    Class.findOneAndUpdate({ _id: classId }, { $pull: { students: studentId } })
        .then(() => res.json('Success, student removed from class!'))
        .catch(err => res.status(500).json(err));
});

module.exports = router;

//TODO remove/add class ids to student document as well
