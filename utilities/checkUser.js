var bcrypt=require("bcrypt-nodejs");
var jwt=require("jsonwebtoken");
var path=require("path");
var User=require(path.join(__dirname,'..','models','user-model'));
var config=require(path.join(__dirname,'..','config','config'));


module.exports.login=(res,email,password) => {
	User.findOne({'email':email}).exec()
		.then((user) => {
			if(user)
			{
				if(user.role === 'admin')
				{
					if(bcrypt.compareSync(password,user.password))
					{
						token=jwt.sign({id:user._id},config.secret,{expiresIn:86400000});
						User.updateOne({"_id":user._id},{$set:{"token.expiry":Date.now()+86400000}},function(err,result){
							if(err)
							{
								console.log(err);
								res.json({success:false});
							}
							else
							{
								res.json({success:true,role:'admin',token:token});
							}
						});
					}
					else
					{
						res.json({success:false,message:"Incorrect Password"});
					}					
				}
				if(user.role === 'public')
				{
					if(bcrypt.compareSync(password,user.password))
					{
						token=jwt.sign({id:user._id},config.secret,{expiresIn:86400000});
						User.updateOne({"_id":user._id},{$set:{"token.expiry":Date.now()+86400000}},function(err,result){
							if(err)
							{
								console.log(err);
								res.json({success:false});
							}
							else
							{
								res.json({success:true,role:'public',token:token});
							}
						});
					}
					else
					{
						res.json({success:false,message:"Incorrect Password"});
					}
				}
			}
			else
			{
				res.json({success:false,message:"User Not Found"});
			}
		});
}
module.exports.register=(req,res) => {
	User.findOne({'email':req.body.email}).exec()
		.then((user) => {
			if(user)
			{
				res.json({success:false,message:"User Already Registered!"});
			}
			else
			{
				console.log("hello");
				if(req.body.email==='admin@gmail.com')
				{
					saveInDb('admin',req,res);
				}
				else
				{
					saveInDb('public',req,res);
				}
			}
		})
		.catch((err) => {
			res.json({success:false,message:"Couldn't Register,Please try Again!"});
		});
}




//Save the details in Database

function saveInDb(role,req,res)
{
	var newUser=new User();
	console.log('In Save In DB');
	User.count({'role':role}).exec()
		.then((numOfDocs) => {
			if(role==='public')
			{
				newUser.username="18WIT"+rightPad(numOfDocs,4);
		        newUser.password=createHash(req.body.password);
		        newUser.name = req.body.name;
		        newUser.email = req.body.email;
		        newUser.schoolRegNo = req.body.schoolRegNo;
		        newUser.gender = req.body.gender;
		        newUser.standard = req.body.standard;
		        newUser.section = req.body.section;
		        newUser.phone = req.body.phone;
		        newUser.school = req.body.school;
			}			
			else
			{
				newUser.username='admin';
		        newUser.password=createHash(req.body.password);
		        newUser.name = req.body.name;
		        newUser.email = req.body.email;
		        newUser.role='admin';
			}
	        newUser.save()
	        	.then(() => {
	        		token=jwt.sign({email:req.body.email},config.secret,{expiresIn:86400});
	        		return token;
	        	})
	        	.then((token) => {
	        		User.updateOne({"email":req.body.email},{$set:{"token.expiry":Date.now()+86400}}).exec()
	        			.then((result) => {
	        				res.json({success:true,token:token,message:"Successfully Registered!"});
	        			})
	        			.catch((err) => {
	        				console.log(err);
	        				res.json({success:true,token:token,message:"Successfully Registered,Login To Continue!"});
	        			});
	        	})
	        	.catch((err) => {
	        		console.log(err);
	        		res.json({success:false});
	        	});
		})
		.catch((err) => {
			console.log(err);
			res.json({success:false,message:"Could Not Register,Try Again!"});
		});

}


// Encrypting Password

var createHash=function(password)
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

//4 digit right pad

var rightPad=function(count,number)
{

    zero="0";
    return (zero.repeat(number-String(count).length)+(count+1));            
}