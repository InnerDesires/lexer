var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({

    _id: Schema.Types.ObjectId,
    name: String

});

module.exports = mongoose.model('Project', projectSchema);