//User.js  -  this is the user model for mongodb
import mongoose from 'mongoose'

//defining the user schema
const userSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    //determines the whether the user is a student or a advisor
    role: {
     type: String,
     enum: ['student', 'advisor'],
     default: 'student'


    },
    contactNumber: {
        type: String,
        required: false,
        default: ''
    },

     // ─── Google OAuth ───
    // Stores Google unique ID for users who sign in with Google
    // null means they registered with email/password
    googleId: {
        type: String,
        default: null
    }
    
}, { timestamps: true});



const User = mongoose.model('User', userSchema);

export default User;