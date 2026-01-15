const express = require('express');
const SalesRouter = express.Router();
const Sales = require('../Models/SalesAgent');
const Lead= require('../Models/Lead');

SalesRouter.post('/agents', async(req, res) => {
    try {
        const {name, email} = req.body;
        const nObj = new Sales({
            name: name,
            email: email,
        });
        const SalesObj = await nObj.save();
        return res.status(201).json({
            message: "New Sales Agent created",
            data: SalesObj
        });
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
});

SalesRouter.get('/agents', async(req, res) => {
    try {
        const Allagents = await Sales.find();
        return res.status(200).json({
            message: "SalesAgent fetched successfully",
            data: Allagents
        });
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
});

SalesRouter.delete('/agents/:id', async(req, res) => {
  try {
    const { id } = req.params;
    
   
    const leadsCount = await Lead.countDocuments({ salesAgent: id });
    
    if (leadsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete agent. ${leadsCount} lead(s) are assigned to this agent. Please reassign or delete the leads first.` 
      });
    }
    
    const deletedAgent = await Sales.findByIdAndDelete(id);
    
    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    
    return res.status(200).json({ message: 'Agent deleted successfully' });
  } catch(error) {
    return res.status(500).json({ message: error.message });
  }
});


module.exports = SalesRouter;