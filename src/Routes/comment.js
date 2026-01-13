const express = require('express');
const CommentRouter = express.Router();
const Lead = require('../Models/Lead');
const Sales = require('../Models/SalesAgent');
const Comment = require('../Models/Comment');

CommentRouter.post('/leads/comments/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const leadExists = await Lead.findById(id);
        
        if (!leadExists) {
            return res.status(404).json({
                message: `Lead with ID ${id} not found.`
            });
        }
        
        const {commentText, author} = req.body;
        
        const nCom = new Comment({
            lead: id,
            author: author,
            commentText: commentText,
        });
        
        const newComment = await nCom.save();
        
        return res.status(201).json({
            message: 'Comment created successfully',
            data: newComment
        });
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
});

CommentRouter.get('/leads/comments/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const leadExists = await Lead.findById(id);
        
        if (!leadExists) {
            return res.status(404).json({
                message: `Lead with ID ${id} not found.`
            });
        }
        
        const AllComments = await Comment.find({lead: id}).populate('author', 'name');
        
        return res.status(200).json({
            message: "Comments fetched successfully",
            data: AllComments,
        });
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
});

module.exports = CommentRouter;