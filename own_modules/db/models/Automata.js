var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var automataSchema = new Schema({

    _id: Schema.Types.ObjectId,
    name: String

});

module.exports = mongoose.model('Automata', automataSchema);