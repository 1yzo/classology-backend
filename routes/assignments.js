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
        await Teacher.findOneAndUpdate({ _id: teacher }, { $push: { assignments: _id } });
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

router.update('/:id', (req, res) => {
    const { id } = req.params;
    const { updates } = req.body;
    Assignment.updateOne({ _id: id }, { ...updates });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Assignment.findOneAndDelete({ _id: id })
        .then(assignment => {
            if (!assignment) {
                res.status(404).json('Assignment not found');
            } else {
                res.json('Success, assignment deleted!');
            }
        });
});
// Routes related to questions
router.post('/:assignmentId/questions', (req, res) => {
    const { assignmentId } = req.params;
    const { ...question } = req.body;
    Assignment.findOneAndUpdate({ _id: assignmentId }, { $push: { questions: question } })
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
        });
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

module.exports = router;

// TODO setup update for assignments and questions
