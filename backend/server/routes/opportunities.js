// opportunities.js - Internship Opportunity Routes
// This file handles all API routes for internship opportunities
// Only advisors can post opportunities, but all users can view them

import express from 'express';
import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import verifyToken, { isAdvisor } from '../middleware/auth.js';

const router = express.Router();

// ─── GET ALL OPPORTUNITIES ───
// Any logged in user (student or advisor) can view opportunities
// Route: GET /api/opportunities
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find all active opportunities and populate advisor name
    const opportunities = await Opportunity.find({ isActive: true })
      .populate('advisorId', 'name email');
    res.json(opportunities);
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST NEW OPPORTUNITY ───
// Only advisors can post new opportunities
// Route: POST /api/opportunities
router.post('/', verifyToken, isAdvisor, async (req, res) => {
  try {
    const { companyName, role, description } = req.body;

    // Create new opportunity linked to the logged in advisor
    const newOpportunity = new Opportunity({
      advisorId: req.user.id,
      companyName,
      role,
      description
    });

    // Save to MongoDB
    await newOpportunity.save();

    res.status(201).json({ 
      message: 'Opportunity posted successfully', 
      opportunity: newOpportunity 
    });
  } catch (error) {
    console.error('Post opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── DELETE OPPORTUNITY ───
// Only advisors can delete their own opportunities
// Route: DELETE /api/opportunities/:id
router.delete('/:id', verifyToken, isAdvisor, async (req, res) => {
  try {
    // Find and delete the opportunity by ID
    const deleted = await Opportunity.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET ALL STUDENTS (for advisor dashboard) ───
// Only advisors can see all students and their applications
// Route: GET /api/opportunities/students
router.get('/students', verifyToken, isAdvisor, async (req, res) => {
  try {
    // Find all students and exclude password field
    const students = await User.find({ role: 'student' }).select('-password');

    // For each student get their applications count and latest status
    const studentsWithApps = await Promise.all(
      students.map(async (student) => {
        const applications = await Application.find({ studentId: student._id });
        return {
          ...student.toObject(),
          applicationCount: applications.length,
          latestStatus: applications.length > 0 
            ? applications[applications.length - 1].status 
            : 'No applications'
        };
      })
    );

    res.json(studentsWithApps);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;