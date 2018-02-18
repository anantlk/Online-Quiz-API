var express = require('express');
var router = express.Router();
var path=require('path');
var jwt=require("jsonwebtoken");
var validate=require(path.join(__dirname,'..','utilities','validate'));
const authentication=require(path.join(__dirname,'..','utilities','utilities'));
let dashpage=require('./users');
var authenticateUser=require(path.join(__dirname,'..','utilities','checkUser'));
var User=require(path.join(__dirname,'..','models','user-model'));
// Login

router.get('/login',(req,res) => {
	console.log("Login Page");
	res.json({success:true,message:""});
});
router.post('/login',validate.login,(req,res) => {
	authenticateUser.login(res,req.body.email,req.body.password);
});

// Register

router.get('/register',function(req,res){
	console.log("Register Page");
	res.json({success:true,message:""});
});

router.post('/register',validate.register,(req,res) => {
	console.log("Fileds Validated");
	authenticateUser.register(req,res);
});

//Logout

router.get('/logout',authentication.isLoggedIn,function(req,res){
	User.updateOne({"email":req.headers['email']},{$set:{"token.expiry":Date.now()}}).exec()
		.then((result) => {
			if(result.nModified)
				res.json({success:true,message:"Logged Out!"});
			else
				res.json({success:false,message:"Please Login!"});
		})
		.catch((err) => {
			console.log(err);
			res.json({success:false,message:"Please Login!"});
		});
});

module.exports = router;
