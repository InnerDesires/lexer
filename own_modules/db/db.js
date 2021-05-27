let mongoose = require('mongoose');
let config = require('../../config/dbconfig.js');
let User = require('./models/User.js');
let Project = require('./models/Project.js');
let Automaton = require('./models/Automaton.js');
const moment = require('moment');
moment.locale('uk');

mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(`Error while connecting to the ${config.connectionString}`)
    } else {
        console.log(`Connected to the ${config.connectionString}`)
    }
});
mongoose.set('useCreateIndex', true);

let db = mongoose.connection;

module.exports = {
    user: {
        findOne: function (condition) {
            return new Promise((resolve, reject) => {
                User.findOne(condition, (err, doc) => {
                    if (err) {
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
                        return reject(err);
                    }
                    resolve(doc);
                })
            });
        },
        find: function (filter) {
            return new Promise((resolve, reject) => {
                User.find(filter || {}, { group: 1, name: 1, email: 1, projects: 1, created: 1, role: 1 }, ((err, users) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    users.forEach(user => { user.date = moment(user.created).format('D.MM YYYY') })
                    resolve(users)
                }))
            });
        }
    },
    project: {
        findById: function (id) {
            console.log(id);
            return new Promise((resolve, reject) => {
                Project.findById(id).populate('automaton').exec((err, doc) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(doc);
                    resolve(doc)
                });
            })
        },
        find: function (filter) {
            return new Promise((resolve, reject) => {
                Project.find(filter || {}).populate('automaton').exec((err, projects) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    projects.forEach(project => {
                        project.date = moment(project.created).format('D.MM YYYY');
                    })
                    resolve(projects);
                })
            });
        },
        create: function (projectData) {
            return new Promise((resolve, reject) => {
                const newProject = new Project(projectData);
                newProject.save((err, doc) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(doc);
                })
            });
        },
    },
    automaton: {
        create: function (automatonData) {
            return new Promise((resolve, reject) => {
                const newAutomaton = new Automaton(automatonData);
                newAutomaton.save((err, doc) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(doc);
                })
            });
        },
        find: function (filter) {
            return new Promise((resolve, reject) => {
                Automaton.find(filter || {}).populate('author').exec((err, automatons) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }

                    automatons.forEach(automaton => {
                        automaton.date = moment(automaton.created).format('D.MM YYYY');
                    })
                    resolve(automatons)
                })
            });
        }
    }
}


