const User = require('../models/user.model.js');
const bcrypt = require("bcryptjs");
const generatejwt = require("../utils/generatetoken.js");
const cloudinary = require("../utils/cloudinary.js");

const signup = async(req,res)=>{
   try {
     const {fullName,email,password} = req.body;
     if(!fullName || !email || !password){
        return res.status(400).json({message : "allfields are mandaotary"});
     }
     if(password.length < 6){
         return res.status(400).json({message : "password must be atleast 6 characters"});
     }
 
     const user = await User.findOne({email});
     if(user){
         return res.status(400).json({message : "user already exists"});
     }
     const salt = await bcrypt.genSalt(10);
     const hashpassword = await bcrypt.hash(password,salt);
 
     const newuser = await User({
         fullName : fullName,
         email : email ,
         password : hashpassword
     })
 
     if(newuser){
        
       await  generatejwt(newuser._id, res);
        await newuser.save();
         res.status(201).json({
            id  : newuser._id,
            fullName : newuser.fullName,
            email : newuser.email,
            profilepic : newuser.profilepic
         })
     }
     else{
         return res.status(400).json({message : "invalid credantils"});
     }
   } catch (error) {
        console.log("error in signup controller " , error.message);
        res.status(500).json({message : "Internal server error"});
    
   }

}

const login = async(req,res)=>{
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({message : "all feilds aee required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid credantils"});
        }
        const ispasswordmatch  = await bcrypt.compare(password , user.password);
        if(!ispasswordmatch){
            return res.status(400).json({message : "Invalid credantils"});
        }
       
           await generatejwt(user._id,res);
            return res.status(200).json({
                fullName  : user.fullName,
                id : user._id,
                email : user.email,
                profilepic : user.profilepic
            });
  
    } catch (error) {
        console.log("error in login controller " , error.message);
        res.status(500).json({message : "internal server error"});
    }
    
}
const logout = async(req,res)=>{
try {   
    const options = {
        httpOnly : true,
        secure : true,
        // expires: new Date(0)
    };
        res.cookie("jwt","",options);
        res.status(200).json({message : "logged out succesfully"});
} catch (error) {
    console.log("error in logout controller" , error.message);
    res.status(500).json({message : "internal server error"});
    
}
    
}
const updateprofile = async (req,res)=>{
    try {
        const {profilePic}  = req.body;
        const userid  = req.user._id;
        if(!profilePic){
            return res.status(400).json({message : "profile pic is required"});
        }

        const uploadedimage = await cloudinary.uploader.upload(profilePic);
        const updateeduser = await User.findByIdAndUpdate(userid , {profilePic : uploadedimage.secure_url} ,{new : true});
        console.log(uploadedimage.secure_url);
        res.status(200).json(updateeduser);
       
        
    } catch (error) {
         console.log("error in updatedprofile controller" , error.message);
         res.status(500).json("internal server error");
    }
};

const checkauth = async(req,res)=>{
    try {
       res.status(200).json(req.user);
        
    } catch (error) {
        console.log("error in checkauth controller ",error.message);
        res.status(500).json("internal server error");
    }
}

module.exports = {signup , login , logout , updateprofile,checkauth};