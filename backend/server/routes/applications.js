// this is different from the Application.js in models
//that one is for db schema 
//this is for handling the routes and CRUD operations
//in this all  the routes are protected and the user must be logged in with a valid JWT token

import express, { application } from 'express';
import Application from '../models/Application.js';
import verifyToken from '../middleware/auth.js'

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
        console.error('Get applications error:', error);
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
        console.error('Add application error:', error);
        res.status(500).json({message: 'Server error'});
    }
});


//UPDATE APPLICATION
// update the existing appliction by its ID
// route : PUT /api/applications/:id
router.put('/:id', verifyToken, async (req, res) =>{
    try {
        const {companyName, role, status, notes } = req.body;

        //find the application by id and update it
        // {new: true} return the updates doc insted of old one
        const updated = await Application.findByIdAndUpdate(
            req.params.id,
            { companyName, role, status, notes },
            { new: true }

        );

        //if no application found with that id return 404
        if (!updated) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({
            message: 'Application updated successfully',
            application: updated
        });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({message: 'Server error'});
    }
});

// DELETE APPLICATION
//deletes an application by its ID
//route: DELETE /api/applications/:id
router.delete('/:id', verifyToken, async (req, res) =>{
    try{
        //find the application by id and delete it
        const deleted = await Application.findByIdAndDelete(req.params.id);

        //if no application found return 404
        if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }
     res.json({ message: 'Application deleted successfully' });


    }  catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;