const express= require('express');
const {connectDb}=require('./dbConnect.js');
require('dotenv').config();
const app= express();
app.use(express.json());
connectDb();

app.listen(7777,()=>{
    console.log('server started at 7777')
}
)