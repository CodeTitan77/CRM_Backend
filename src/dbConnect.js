const mongoose=require('mongoose');
require("dotenv").config();
const connectDb= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI).then(
            console.log("Database connected"));
    }
    catch(error){
        console.log("Error in database connection");
    }

}
module.exports={connectDb};

