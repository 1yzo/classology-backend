const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const { questionTypes } = require('../contstants');

const questionSchema = new Schema({
    type: { type: String, required: true, validate: typeValidator },
    details: String,
    pointValue: { type: Number, required: true },
    image: String
});

function typeValidator(value) {
    return Object.values(questionTypes).includes(value);
}

const assignmentSchema = new Schema({
    teacher: { type: ObjectId, ref: 'Teacher', required: true },
    name: { type: String, require: true },
    questions: [questionSchema]
});


const Assignment = mongoose.model('Assignment', assignmentSchema);
