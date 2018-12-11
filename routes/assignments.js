const express = require('express');
const router = express.Router();

const Assignment = require('../models/assignment');
const Teacher = require('../models/Teacher');

router.post('/', async (req, res) => {
    const { teacher, name, questions } = req.body;
    const assignment = new Assignment({
        teacher,
        name,
        questions
    });
    try {
        const { _id } = await assignment.save();
        await Teacher.findOneAndUpdate({ _id: teacher }, { $addToSet: { assignments: _id } });
        res.json('Success, assignment created!');
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Assignment.findOne({ _id: id })
        .then(assignment => {
            if (!assignment) {
                res.status(404).json('Assignment not found');
            } else {
                res.json(assignment);
            }
        })
        .catch(err => res.status(500).json(err));
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    Assignment.updateOne({ _id: id }, { ...updates })
        .then(info => {
            if (info.n === 1) {
                res.json('Success, assignment updated!');
            } else {
                res.status(404).json('Assignment not found');
            }
        })
        .catch(err => res.status(500).json(err));
});

// Make sure to remove the assignment from any classes it's currently assigned tod
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Assignment.findOneAndDelete({ _id: id })
        .then(assignment => {
            if (!assignment) {
                res.status(404).json('Assignment not found');
                throw new Error('break');
            } else {
                return assignment.teacher;
            }
        })
        .then(teacherId => Teacher.findOneAndUpdate({ _id: teacherId }, { $pull: { assignments: id } }))
        .then(() => res.json('Success, assignment deleted!'))
        .catch(err => {
            if (err.message === 'break') return;
            res.status(500).json(err)
        });
});

// Routes related to questions
router.post('/:assignmentId/questions', (req, res) => {
    const { assignmentId } = req.params;
    const { ...question } = req.body;
    Assignment.findOneAndUpdate({ _id: assignmentId }, { $addToSet: { questions: question } })
        .then(() => res.json('Success, question created!'))
        .catch(err => res.status(500).json(err));
});

router.get('/:assignmentId/questions/:id', (req, res) => {
    const { assignmentId, id } = req.params;
    Assignment.findOne({ _id: assignmentId })
        .then(assignment => {
            const question = assignment.questions.id(id);
            if (!question) {
                res.status(404).json('Question not found');
            } else {
                res.json(question);
            }
        })
        .catch(err => res.status(500).json(err));
});

router.put('/:assignmentId/questions/:id', (req, res) => {
    const { assignmentId, id } = req.params;
    const updates = req.body;
    Assignment.findOne({ _id: assignmentId })
        .then(assignment => {
            const question = assignment.questions.id(id);
            if (question) {
                question.set({ ...updates });
                return assignment.save();
            }
        })
        .then(info => {
            if (!info) {
                res.status(404).json('Question not found');
            } else {
                res.json('Success, question updated!');
            }
        })
        .catch(err => res.status(500).json(err));
});

router.delete('/:assignmentId/questions/:id', (req, res) => {
    const { assignmentId, id } = req.params;
    Assignment.findOne({ _id: assignmentId })
        .then(assignment => {
            assignment.questions.id(id).remove();
            return assignment.save();
        })
        .then(() => res.json('Success, question deleted!'))
        .catch(err => res.status(500).json(err));
});

//TODO endpoint to edit classAssignments (specifically the times)

module.exports = router;
