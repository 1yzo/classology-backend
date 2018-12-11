const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const teacherSchema = new Schema({
    userId: { type: ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    assignments: [{ type: ObjectId, ref: 'Assignment' }],
    classes: [{ type: ObjectId, ref: 'Class' }]
});

const Teacher = mongoose.models['Teacher'] || mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
