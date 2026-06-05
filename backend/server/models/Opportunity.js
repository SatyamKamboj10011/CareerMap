// Internship opportunity model for mongoDB
import pkg from 'mongoose';
const {Schema, model } = pkg;

//defining the opportunity schema
const opportunitySchema = new Schema({
    //reference to the advisor who posted the opportunity
    advisorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        requried: true
    },
    companyName: {
        type: String,
        required:true
    },
    role: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    //check whether the opportunity is still active
    isActive: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

const Opportunity = model('Opportunity', opportunitySchema);

export default Opportunity;