// add admin route
// add view answerscripts view routes
// add  solution routes

const express = require('express');
const router = express.Router();
const path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User=require(path.join(__dirname,'..','models','user-model'));
var answerScript=require(path.join(__dirname,'..','models','answerScript-model'));
var details=[];
var userId=[]
const Question = require(path.join(__dirname, '..', 'models', 'question-model'));
const authentication=require(path.join(__dirname, '..', 'utilities', 'utilities'));

// admin view details

router.get("/", authentication.isLoggedIn,(req,res) => {
  console.log("In Admin Get Route!!");
  User.find({}).exec()
    .then((user) => {
      var details=[];
      var userId=[];
      user.forEach(function(data){
        if(data.exam.attempted==true)
        {
          userId.push(data._id);
          details.push({
            name:data.name,
            email:data.email,
            username:data.username,
            marksObtained:data.exam.marksObtained,
            timeTaken:data.exam.timeTaken,
            selected:data.exam.selected
          });
        };
      });
      return [details,userId];
    })
    .then((arr) => {
      console.log(arr[1]);
      answerScript.find({"userId":arr[1]}).exec()
        .then((answers) => {
          answers.forEach(function(data,index){
            arr[0][index].evaluated=data.evaluated;
          });
          console.log(arr[0]);
          res.json({success:true,users:arr[0]});
        })
        .catch((err) => {
          console.log(err);
          res.json({success:false,message:"Error Occured!"});
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({success:false,message:"Error Occured!"});
    });
});


//view user answer script


router.get("/check/:username",authentication.isLoggedIn,(req,res) => {
  username=req.params.username;
  console.log(username);
  User.findOne({"username":username}).exec()
    .then((user) => {
      console.log(username);
      return user;
    })
    .then((user) => {
      console.log(user);
      answerScript.findOne({"userId":user._id}).exec()
        .then((answer) => {
          res.json({username:user.username,email:user.email,name:user.name,answer:answer.answers});
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});


//check and submit answer script

router.post("/check/:username",authentication.isLoggedIn,(req,res) => {
  username=req.params.username;
  User.updateOne({"username":username},{$set:{'exam.marksObtained':req.body.marks,'exam.selected':req.body.selected}}).exec()
    .then((result) => {
      console.log(result);
    })
    .then(() =>{
      User.findOne({"username":username}).exec()
      .then((user) => {
        return user._id;
      })
      .then((id) => {
        answerScript.updateOne({"userId":id},{$set:{evaluated:true}}).exec()
          .then((result) => {
            console.log(result);
            res.json({success:true,message:"Evaluation Done!"});
          })
          .catch((err) => {
            res.json({success:false,message:"Some Error In Submission!!"});
            console.log(err);});
      })
      .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.json({success:false,message:"Some Error!!"});
      console.log(err);
    });
});


// add mcq questions

router.post('/addQuestion/mcq', (req, res, next) => {
    console.log("Hello");
    const valid = (req.body.question && req.body.optionA && req.body.optionB && req.body.optionC && req.body.optionD && req.body.correctAnswer);
    console.log(req.body.question);
    console.log(req.body.optionA);
    console.log(req.body.optionB);
    console.log(req.body.optionC);
    console.log(req.body.optionD);
    console.log(req.body.correctAnswer);
    if(valid){
        Question.findOne({
          'question' : req.body.question
          }).exec()
          .then((question)=>{
            if(question){
                return res.json({question : "Question already exists find another"})
            } else{
                const newQues = new Question();
                Question.count().exec()
                .then((numOfDocs) => {
                    newQues.questionNo=numOfDocs+1;
                    newQues.question = req.body.question;
                    newQues.optionA = req.body.optionA;
                    newQues.optionB = req.body.optionB;
                    newQues.optionC = req.body.optionC;
                    newQues.optionD = req.body.optionD;
                    newQues.correctAnswer = req.body.correctAnswer;
                    newQues.quesType = "mcq";
                    console.log(newQues);
                    newQues.save()
                          .then(function (){console.log("saved Question");res.json({ success : true , question : "saved" })})
                          .catch((err) => {
                            console.log(err);
                            res.json({ success : false})
                          });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({success:false});
               });
            }
        }).catch((err) => {
          console.log(err);
          res.json({success:false});
        });
      }
      else {
        var error = new Error('Bad Request');
        error.status = 400;
        next(error);
      }         
});


// add subjective questions

router.post('/addQuestion/desc', (req, res, next) => {
  const valid = (req.body.question && req.body.correctAnswer);
  if(valid){
      Question.findOne({
        'question' : req.body.question
        }).exec()
        .then((question) => {
          if(question){
              return res.json({question : "Question already exists find another"})
          } else{
              const newQues = new Question();
                Question.count().exec()
                .then((numOfQues) => {
                  newQues.questionNo=numOfQues+1;
                  newQues.question = req.body.question;
                  newQues.correctAnswer = req.body.correctAnswer;
                  newQues.quesType = "desc";
                  // console.log(newQues);
                  newQues.save()
                        .then(() => {
                          console.log("saved Question");
                          res.json({ success : true , question : "saved" })
                        })
                        .catch((err) => {
                          console.log(err);
                          res.json({success:false});
                        });
              });
          }
      }).catch((err) => {
        console.log(err);
        res.json({success:false});
      });
    }
    else {
      var error = new Error('Bad Request');
      error.status = 400;
      next(error);
    }         
});

module.exports = router;