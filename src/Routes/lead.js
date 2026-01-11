const express= require('express');
const Lead= require('../Models/Lead');
const Sales= require('../Models/SalesAgent');
const LeadRouter=express.Router();

LeadRouter.put('/leads/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const LeadObj= await Lead.findByIdAndUpdate(id,{
            name:req.body.name,
            source:req.body.source,
            salesAgent: req.body.salesAgent, 
            status: req.body.status,
            tags: req.body.tags,
            timeToClose: req.body.timeToClose,
            priority: req.body.priority,

        },{new:true});
        if(!LeadObj){
            return res.status(404).json({message: `Lead with ${id} does not exist`});
        }
         return res.status(201).json({message:'Lead updated successfully',data:LeadObj});


    }
    catch(error){
      return res.status(400).json({message:error.message})

    }
   

});
LeadRouter.delete('/leads/:id',async(req,res)=>{
      try{
        const {id}=req.params;
        const DelObj= await Lead.findByIdAndDelete(id);
         if (!DelObj) {
            return res.status(404).json({message: "Lead not found"});
        }
        
        return res.status(201).json({message: 'Lead deleted successfully'});
    }
    catch(error) {
        return res.status(500).json({message: error.message});
    }
});
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
LeadRouter.get('/leads', async(req, res) => {
    try {
        const statusArray = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
        const tagArray = ['High Value', 'Follow-up'];
        const srcArray = ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'];
        
        const {salesAgent, status, tags, source} = req.query;
        
        if (salesAgent && salesAgent !== '') {
            const SalesAgent = await Sales.findById(salesAgent);
            if (!SalesAgent) {
                return res.status(400).json({message: "Invalid salesAgent"});
            }
        }
        
        if (status && status !== '' && !statusArray.includes(status)) {
            return res.status(400).json({
                error: "Invalid input: 'status' must be one of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed']."
            });
        }
        
        if (source && source !== '' && !srcArray.includes(source)) {
            return res.status(400).json({
                error: `Invalid input: 'source' must be one of ${JSON.stringify(srcArray)}.`
            });
        }
        
        if (tags && tags !== '' && !tagArray.includes(tags)) {
            return res.status(400).json({
                error: `Invalid input: 'tags' must be one of ${JSON.stringify(tagArray)}.`
            });
        }
        
        let filter = {};
        if (salesAgent && salesAgent !== '') filter.salesAgent = salesAgent;
        if (status && status !== '') filter.status = status;
        if (source && source !== '') filter.source = source;
        if (tags && tags !== '') filter.tags = tags;
        
        const leads = await Lead.find(filter).populate('salesAgent', 'name');
        
        return res.status(201).json({data:leads});
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
});
LeadRouter.get('/report/last-week',async(req,res)=>{
    try{
    const sevenDaysAgo= new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const closedLeads= await Lead.find(
        {
            status:'Closed',
            updatedAt:{
                $gte:sevenDaysAgo
            }

        }
    ).populate('salesAgent', 'name');
    return res.status(200).json({
        message:'Leads fetched successfully',
        data:closedLeads
    });
    }
    catch(error){
      return res.status(400).json({message: error.message});
    }
    
    

});


LeadRouter.get('/report/pipeline', async(req, res) => {
    try {
        const totalLeadsInPipeline = await Lead.countDocuments({
            status: { $ne: 'Closed' }
        });
        
        return res.status(200).json({
            totalLeadsInPipeline: totalLeadsInPipeline
        });
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
});

module.exports=LeadRouter;
