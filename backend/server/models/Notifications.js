import pkg from 'mongoose';
const { Schema, model } = pkg;

const notificationSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default model('Notification', notificationSchema);