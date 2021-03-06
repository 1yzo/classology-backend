const express = require('express');
const router = express.Router();

const Class = require('../models/class');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

router.post('/', async (req, res) => {
    const { teacher, name, description } = req.body;
    const newClass = new Class({
        teacher,
        name,
        description
    });
    try {
        const { id } = await newClass.save();
        await Teacher.findOneAndUpdate({ _id: teacher }, { $addToSet: { classes: id } });
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

// Routes related to students
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
    Class.findOneAndUpdate({ _id: classId }, { $addToSet: { students: student } })
        .then(() => Student.findOneAndUpdate({ _id: student }, { $addToSet: { classes: classId } }))
        .then(() => res.json('Success, student added to class!'))
        .catch(err => res.status(500).json(err));
});

router.delete('/:classId/students/:studentId', (req, res) => {
    const { classId, studentId } = req.params;
    Class.findOneAndUpdate({ _id: classId }, { $pull: { students: studentId } })
        .then(() => Student.findOneAndUpdate({ _id: studentId }, { $pull: { classes: classId } }))
        .then(() => res.json('Success, student removed from class!'))
        .catch(err => res.status(500).json(err));
});

// Routes related to assignments
router.post('/:classId/assignments', (req, res) => {
    const { classId } = req.params;
    const { assignmentId, startDate, endDate } = req.body;
    const classAssignment = {
        startDate,
        endDate,
        assignmentId
    };

    Class.findOneAndUpdate({ _id: classId }, { $push: { classAssignments: classAssignment } })
        .then(() => res.json('Success, assignment added to class!'))
        .catch(err => res.status(err).json(err));
});

router.delete('/:classId/assignments/:assignmentId', (req, res) => {
    const { classId, assignmentId } = req.params;
    Class.findOneAndUpdate({ _id: classId }, { $pull: { classAssignments: { _id: assignmentId } } })
        .then(() => res.json('Success, assignment removed from class!'))
        .catch(err => res.status(500).json(err));
});

router.put('/:classId/assignments/:assignmentId', (req, res) => {
    const { classId, assignmentId } = req.params;
    const updates = req.body;
    Class.findOne({ _id: classId })
        .then(classPayload => {
            const assignment = classPayload.classAssignments.id(assignmentId);
            if (assignment) {
                assignment.set(updates);
                return classPayload.save();
            }
        })
        .then(info => {
            if (!info) {
                res.status(404).json('Assignment not found');
            } else {
                res.json('Success, assignment updated!');
            }
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;
