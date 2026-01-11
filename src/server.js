const express = require('express');
const {connectDb} = require('./dbConnect.js');
const LeadRouter = require('./Routes/lead.js');
const SalesRouter = require('./Routes/sales.js');
const CommentRouter = require('./Routes/comment.js');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

connectDb();

app.use('/', LeadRouter);
app.use('/', SalesRouter);
app.use('/', CommentRouter);

app.listen(7777, () => {
    console.log('server started at 7777');
});