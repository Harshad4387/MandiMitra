const jwt = require("jsonwebtoken");

const generatejwt = async (userid , res)=>{
    const token = await jwt.sign({userid}, process.env.JWT_TOKEN_SECERT , {
       expiresIn : process.env.JWT_TOKEN_EXPIRY
    });

    const options = {
        httpOnly : true,
        secure : true,
    
    };
    res.cookie("jwt", token, options); 
    return token;
};


module.exports = generatejwt;