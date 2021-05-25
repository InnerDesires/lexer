var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var automatonSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    name: String,
    json: String,
    testCode: String,
    textForm: String,
    created: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Automaton', automatonSchema);