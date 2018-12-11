const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const gradeSchema = new Schema({
    assignmentName: { type: String, required: true },
    assignmentId: { type: ObjectId, required: true },
    correct: [Number],  // question numbers
    incorrect: [Number]
});

const studentSchema = new Schema({
    userId: { type: ObjectId, required: true },
    schoolId: { type: String, required: true },
    assignments: [{ type: ObjectId, ref: 'Assignment' }],
    classes: [{ type: ObjectId, ref: 'Class' }],
    grades: [gradeSchema]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
