const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SolutionSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required : true,
        unique : true
    },
    marks : {
        type : Number,
        required : true
    },
    selected : {
        type : String,
        enum : ['yes', 'No', 'Maybe'],
        default : 'No'
    }
});

module.exports = mongoose.model('answerScript', answerScriptSchema );