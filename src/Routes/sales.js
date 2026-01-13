const express = require('express');
const SalesRouter = express.Router();
const Sales = require('../Models/SalesAgent');

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


module.exports = SalesRouter;