const express = require("express");
const router = express.Router();
const User = require("../DB/User");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
// const {authenticateToken}=require('./UserAuth')

const {authenticateToken}=require("./UsersAuth");



router.post("/sign-up" ,async (req,res)=>{
try {
    const {username,phone,email,password,imageurl}= req.body;

    const existingUser = await User.findOne({email:email})

    if(existingUser){
       return res.status(400).json({message:"Email Already exist "})
    }

    const hashpass =await bcrypt.hash(password,10)

    const newUser = new User({
        username:username,
        phone:phone,
        email:email,
        password:hashpass,
        imageurl:imageurl
    }) 

    await newUser.save();

  return res.status(201).json({message:"User created succesfully"});
} catch (error) {
    console.log("error",error)
   res.status(500).json({message:"server Error"}); 
}

})

router.post("/sign-in" ,async (req,res)=>{
    try {
        const {email,password}= req.body;

        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            return res.status(404).json({ message: "Invalid Credential" });
        }
 
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
        const secrete = process.env.SECRET_JWT;
        const token = jwt.sign(
            { email: existingUser.email, role: existingUser.role },
            `${secrete}`,
            { expiresIn: "30d" }
        );

        return res.status(200).json({
            id: existingUser._id,
            role: existingUser.role,
            token: token
        });

    } catch (error) {
        return res.status(500).json({message:"Server Error"});
    }
})


router.get("/get-user",authenticateToken, async(req,res)=>{
    const {id}= req.headers
    
    const AllUser = await User.findById(id);
    // console.log(AllUser);
    res.json({
        message: "success",
        data:AllUser
    })
})

router.get("/get-user-id/:id",async(req,res)=>{

    const{id}=req.params 

    const AllUser = await User.findById(id);

    console.log(AllUser);
    res.json({
        message: "success",
        data:AllUser
    })
})



module.exports = router;