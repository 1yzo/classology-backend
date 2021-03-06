const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

// Assingment meta information specific to a certain class
const classAssignmentSchema = new Schema({
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    assignmentId: { type: ObjectId, ref: 'Assignment' }
});

const classSchema = new Schema({
    teacher: { type: ObjectId, ref: 'Teacher', required: true },
    name: { type: String, required: true },
    description: String,
    students: [{ type: ObjectId, ref: 'Student' }],
    classAssignments: [classAssignmentSchema]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
