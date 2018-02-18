const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionNo:{
        type:Number,
        required:true
    },
    question : {
        type : String,
        required : true
    },
    optionA : {
        type : String,
        //required : true
    },
    optionB : {
        type : String,
        //required : true
    },
    optionC : {
        type : String,
        //required : true
    },
    optionD : {
        type : String,
        //required : true
    },
    quesType : {
        type: String, 
        enum: ['desc', 'mcq'], 
        default: 'mcq'
    },
    correctAnswer : {
        type : String,
        required : true
    }
})
const Question = mongoose.model('questions', questionSchema);

module.exports = Question;