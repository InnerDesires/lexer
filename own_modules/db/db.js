let mongoose = require('mongoose');
let config = require('../../config/dbconfig.js');
let User = require('./models/User.js');
let Project = require('./models/Project.js');
let Automata = require('./models/Automata.js');

mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(`Error while connecting to the ${config.connectionString}`)
    } else {
        console.log(`Connected to the ${config.connectionString}`)
    }
});

let db = mongoose.connection;

module.exports = {
    user: {
        findOne: function (condition) {
            return new Promise((resolve, reject) => {
                User.findOne(condition, (err, doc) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(doc)
                })
            })
        },
        create: function (userData) {
            return new Promise((resolve, reject) => {
                const newUser = new User(userData);
                newUser.save((err, doc) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(doc);
                })
            });



        },
    },
    project: {

    },
    automata: {

    }
}


