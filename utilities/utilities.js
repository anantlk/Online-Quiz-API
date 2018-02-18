const path = require('path');
const Promise = require('bluebird');
var jwt=require("jsonwebtoken");
const User = require(path.join(__dirname, '..', 'models', 'user-model'));
const config=require(path.join(__dirname,'..','config','config'))

module.exports.isLoggedIn = (req,res,next) => {
  var token=req.headers['x-access-token'];
  if(!token)
  {
    res.json({success:false,message:'No Token Provided'});
  }
  else
  {
    jwt.verify(token,config.secret,function(err,decoded){
      if(err)
      {
        res.json({success:false,message:"Invalid User"});
      }
      User.findOne({'email':req.headers['email']}).exec()
        .then((user) => {
          if(user)
          {
            if(Date.now()<user.token.expiry)
              next();
            else
              res.json({success:false,message:"Please Login!"});
          }
          else
          {
            res.json({success:false,message:"No Such User!"});
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({success:false});
        });
    });
  }
}

module.exports.errHandler = (err)=> {
  console.error('There was an error performing the operation');
  console.log(err);
  console.log(err.code);
  return console.error(err.message);
}

module.exports.validationErr = (err, res)=> {
  Object.keys(err.errors).forEach(function (k) {
    var msg = err.errors[k].message;
    console.error('Validation error for \'%s' +': %s', k, msg);
    return res.status(404).json({
      msg: 'Please ensure required fields are filled'});
  });
}

// check
module.exports.validateScope = (newUser, userDetails) => {
  return new Promise((resolve, reject) => {
      if (userDetails.email == process.env.ADMIN_ID && userDetails.password == process.env.ADMIN_PASS){
          newUser.role = 'admin';
          console.log("admin identified.");
      } else {
          const totalCount = User.count({ role: "public" }).exec()
              .then((count) => {
                  count+=1;
                  console.log(count);
                  newUser.username = "18WTM" + count.toString().padStart(4, "0");
                  console.log(newUser.username);
                  console.log("validated");
                  return resolve(newUser);
              });
              //.catch(reject(newUser));
      }
  })
};
