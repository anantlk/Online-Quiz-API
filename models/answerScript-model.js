const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerScriptSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required : true,
        unique : true
    },
    answers: [{question: String, answer: String}],
    evaluated:{
    	type:Boolean,
    	default:false
    }
});

module.exports = mongoose.model('answerScript', answerScriptSchema );