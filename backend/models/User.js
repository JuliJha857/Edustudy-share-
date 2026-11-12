const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  branch: String,
  semester: String,
  role: { type: String, enum: ['student','admin'], default: 'student' }
});
module.exports = mongoose.model('User', userSchema);