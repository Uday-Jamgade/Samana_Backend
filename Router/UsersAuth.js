const jwt=require("jsonwebtoken");

const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token==null){
        return res.status(401).json({message: "Authentication Token required "});
    }
    const secrete = process.env.SECRET_JWT;
    jwt.verify(token,`${secrete}`,(err,user)=>{
     if(err){
        return res.status(403).json({
            message: "token expred "
        })   
     }
     req.user=user;
     next();

    })
}

module.exports={authenticateToken}