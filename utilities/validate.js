module.exports.login=(req,res,next) => {
    if(!req.body.email)
    {
        res.json({success:false,message:"Email Field Can't Be Empty"});
    }
    else if(!req.body.password)
    {
        res.json({success:false,message:"Password Field Can't Be Empty"});
    }
    else
    {
        return next();
    }
}
module.exports.register=(req,res,next) => {
   if(req.body.name && req.body.email && req.body.password && req.body.confirmPassword && req.body.phone && req.body.section && req.body.schoolRegNo && req.body.standard && req.body.school)
    {
        next();
    }
    else
    {
        res.json({success:false,message:"Please Fill Up Every Field"});
    }
}


