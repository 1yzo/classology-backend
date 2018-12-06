const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const teacherSchema = new Schema({
    name: { type: String, required: true },
    assignments: [ObjectId],
    classes: [ObjectId]
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
