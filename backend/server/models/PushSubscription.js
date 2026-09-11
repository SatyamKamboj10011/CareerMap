// PushSubscription.js - stores browser push subscriptions per student
// Replaces the old in-memory array so subscriptions survive server restarts
import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    endpoint: {
        type: String,
        required: true
    },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    }
}, { timestamps: true });

const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);

export default PushSubscription;
