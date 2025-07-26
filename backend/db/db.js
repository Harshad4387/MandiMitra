const mongoose = require("mongoose");

const connect = async()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/mandimitra`);
        console.log("database connected succesfully");
  
    }
    catch(error){
        console.log(error);
    }
}

module.exports = connect;