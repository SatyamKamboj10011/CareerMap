// this is different from the Application.js in models
//that one is for db schema
//this is for handling the routes and CRUD operations
//in this all  the routes are protected and the user must be logged in with a valid JWT token

import express from 'express';
import Application from '../models/Application.js';
import verifyToken from '../middleware/auth.js'
import logger from '../logger.js';

const router = express.Router();

// GET ALL APPLICATIONS
//this returns all the applications related to the logged in student
//route: GET /api/applications

router.get('/', verifyToken, async (req, res) =>{
    try{
        //the req.user.id comes from the JWT token verified in middleware
    //this insures that students can only see their applications
    const applications = await Application.find({studentId: req.user.id});

    res.json(applications);
    } catch (error) {
        logger.error(`Get applications error: ${error.message}`);
        res.status(500).json({message: 'Server error'});
    }
});


//ADD NEW APPLICATION
//creates a new internship application for logged in student
//route: POST /api/applications
router.post('/', verifyToken, async (req, res) =>{
    try{
        const{ companyName, role, status, appliedDate, notes } = req.body;

        //create a new application and link it to the logged in student
        const newApplication = new Application({
            studentId: req.user.id, //this automatically stet from the JWT token
            companyName,
            role,
            status,
            appliedDate,
            notes        
        
        });

        //save the application to mongodb Atlas
        await newApplication.save();

        res.status(201).json({
            message:'Application added successfully',
            application: newApplication
        });

    } catch (error) {
        logger.error(`Add application error: ${error.message}`);
        res.status(500).json({message: 'Server error'});
    }
});


//UPDATE APPLICATION
// update the existing appliction by its ID
// route : PUT /api/applications/:id
router.put('/:id', verifyToken, async (req, res) =>{
    try {
        const {companyName, role, status, notes } = req.body;

        //find the application by id AND ownership, then update it
        // {new: true} return the updates doc insted of old one
        // studentId filter prevents one student from editing another student's application
        const updated = await Application.findOneAndUpdate(
            { _id: req.params.id, studentId: req.user.id },
            { companyName, role, status, notes },
            { new: true }

        );

        //if no application found with that id (or it doesn't belong to this user) return 404
        if (!updated) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({
            message: 'Application updated successfully',
            application: updated
        });
    } catch (error) {
        logger.error(`Update application error: ${error.message}`);
        res.status(500).json({message: 'Server error'});
    }
});

// DELETE APPLICATION
//deletes an application by its ID
//route: DELETE /api/applications/:id
router.delete('/:id', verifyToken, async (req, res) =>{
    try{
        //find the application by id AND ownership, then delete it
        // studentId filter prevents one student from deleting another student's application
        const deleted = await Application.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });

        //if no application found return 404
        if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }
     res.json({ message: 'Application deleted successfully' });


    }  catch (error) {
    logger.error(`Delete application error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;