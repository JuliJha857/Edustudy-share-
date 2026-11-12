const mongoose = require('mongoose');
const resourceSchema = new mongoose.Schema({
  title: String,
  subject: String,
  branch: String,
  semester: String,
  type: { type: String, enum: ['Notes','PYQ','Lab Manual'] },
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  downloadCount: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Resource', resourceSchema);