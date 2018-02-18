const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); 

const userSchema = new Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    username:{
        type:String,
    },
    schoolRegNo : {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    gender : {
        type: String,
    },
    standard : {
        type: String,
    },
    section : {
        type: String,
    },
    phone : String,
    school : {
        type: String,
    },
    role: { 
        type: String, 
        enum: ['admin', 'public'], 
        default: 'public'
    },
    exam:{
        attempted:
        {
            type:Boolean,
            enum:[false,true],
            default:false
        },
        timeTaken:
        {
            type:String,
            default:null
        },
        marksObtained:
        {
            type:Number,
            default:null
        },
        selected:{
            type:String,
            enum:['Yes','No','Maybe'],
            default:'No'
        }
    },
    token:{
        expiry:{
        type:Date
        }
    }
});

userSchema.methods.comparePassword = function (enteredPwd) {
    return (this.password == enteredPwd);
}


const User = mongoose.model('User', userSchema);

module.exports = User;