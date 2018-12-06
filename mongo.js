const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbName = 'ClassologyDB';

const connect = () => {
    mongoose.connect('mongodb://localhost:27017', { dbName, useNewUrlParser: true }).then(() => {
        console.log('Mongoose connected');
        process.on('SIGNIT', () => {
            mongoose.connection.close(() => {
                console.log('Mongoose disconnected on app termination');
                process.exit();
            });
        });
    });
};

module.exports = {
    connect
};
