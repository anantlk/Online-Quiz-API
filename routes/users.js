var express = require('express');
var router = express.Router();
var path=require('path');
var questionPaper=require(path.join(__dirname,'..','models','question-model'));
var answerScript=require(path.join(__dirname,'..','models','answerScript-model'));
var User=require(path.join(__dirname,'..','models','user-model'));
const authentication=require(path.join(__dirname,'..','utilities','utilities'));

// Variables

var quesNo=[],temp,index1,index2;
var qPaper=[];

router.get("/profile",authentication.isLoggedIn,function(req,res){
	User.findOne({'email':req.headers['email']}).exec()
        .then((user) => {res.json(
			{
				"success":"true",
				"name": user.name,
				"email": user.email,
				"school": user.school,
				"schoolRegNum": user.schoolRegNo,
				"standard":user.standard,
				"section": user.section,
				"phone": user.phone,
				"exam": user.exam,
				"username": user.username
			});
		})
});

// router.get("/dahsboard",authentication.isLoggedIn,function(req,res){
// 	res.render('dashboard');
// });


// Start Exam

router.get("/exam",authentication.isLoggedIn,(req,res) => {
	var preparePaper=function(){
		new Promise(function(resolve,reject){
			questionPaper.find({'quesType':'mcq'})
				.then((mcqQuestions) => {
						// Shuffle The Question Numbers
						qPaper=[];
						for(index1=mcqQuestions.length-1;index1>=0;index1-=1)
						{
							index2=Math.floor(Math.random()*(index1+1));
							temp=mcqQuestions[index1];
							mcqQuestions[index1]=mcqQuestions[index2];
							mcqQuestions[index2]=temp;
						}
						
						mcqQuestions.forEach(function(data,index){
							if(index>6)
							{
								return false;
							}
							qPaper.push({
								"question":data.question,
								"opt1":data.optionA,
								"opt2":data.optionB,
								"opt3":data.optionC,
								"opt4":data.optionD,
								"quesType":data.quesType
							});
						});
						resolve(qPaper)
						// res.render('exam',{paper:qPaper});
				})
				.catch((err) => {
					reject(err);
					res.json({success:false});
				});		
		})
		.then(function(qPaper){
			questionPaper.find({'quesType':'desc'})
			.then((descQuestions) => {
					// Shuffle The Question Numbers
					for(index1=descQuestions.length-1;index1>=0;index1-=1)
					{
						index2=Math.floor(Math.random()*(index1+1));
						temp=descQuestions[index1];
						descQuestions[index1]=descQuestions[index2];
						descQuestions[index2]=temp;
					}
					
					descQuestions.forEach(function(data,index){
						if(index>2)
						{
							return false;
						}
						qPaper.push({
							"question":data.question,
							"quesType":data.quesType
						});
					});
					console.log(qPaper);
					res.json({success:true,paper:qPaper});
			})
			.catch((err) => {
				console.log(err);
				res.json({success:false,message:"Error Occured"});
			});		
		})
		.catch(function(err){
			console.log(err);
			res.json({success:false});
		});
	}
	preparePaper();
});

// Submit Exam

router.post("/exam/submit",authentication.isLoggedIn,(req,res) => {
	console.log(req);
	User.findOne({'email':req.headers['email']}).exec()
		.then((user) => {
			return user;
		})
		.then((user) => {
			answerScript.findOne({'userId':user._id}).exec()
					.then(function(answer){
						if(answer)
						{
							console.log("Answer Script Already There!!");
							res.json({success:false,message:"Answer Script Already Present"});
						}
						else
						{
							var answer=new answerScript();
							answer.userId=user._id;
							console.log(req.body.answers);
							req.body.answers.forEach(function(data){
								answer.answers.push(data);
							});

							answer.save()
								.then(function(){
									console.log("Answer Script Saved!!");
								})
								.then(function(){
									User.updateOne({"_id":user._id},{ $set:{'exam.attempted':true,'exam.timeTaken':req.body.time}}).exec()
										.then(function(user){
											console.log("User Detail Updated!");
											res.json({success:true,message:"Answer Saved Successfully!!"})
										})
										.catch((err) => {
											console.log(err);
											res.json({success:false});
										});
								})
								.catch((err) => {
									res.json({success:false})
									console.log(err);
								});
						}
					})
					.catch((err) => {
						res.json({success:false});
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
				res.json({success:false});
			});
});

module.exports = router;
