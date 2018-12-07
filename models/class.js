const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

// Assingment meta information specific to a certain class
const classAssignmentSchema = new Schema({
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    assignmentId: ObjectId
});

const classSchema = new Schema({
    name: { Type: String, required: true },
    description: String,
    students: [ObjectId],
    classAssignments: [classAssignmentSchema]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
