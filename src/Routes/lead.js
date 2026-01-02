const express= require('express');
const Lead= require('../Models/Lead');
const LeadRouter=express.Router();
LeadRouter.post('/leads',async(req,res)=>{
    try{
        const nobj= new Lead({
            name:req.body.name,
            source:req.body.source,
            salesAgent: req.body.salesAgent, 
            status: req.body.status,
            tags: req.body.tags,
            timeToClose: req.body.timeToClose,
            priority: req.body.priority,
        })
        const createdObj=await nobj.save();
        return res.status(201).json({message:'New Lead added successfully',data:createdObj});

    }
    catch(error){
        return res.status(400).json({message:error.message})
    }
})
LeadRouter.get('/leads',async(req,res)=>{
    

})
