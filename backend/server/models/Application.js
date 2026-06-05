// Application.js is the internship applciation model fro MongoDB
import mongoose from "mongoose";

//defining the application schema
const applicationSchema = new mongoose.Schema({
    //reference to the student who created the application
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },

    //pipleline stages
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Accepted', 'Rejected'],
        default: 'Applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }

}, {timestamps: true});

const Application = mongoose.model('Application', applicationSchema);

export default Application;