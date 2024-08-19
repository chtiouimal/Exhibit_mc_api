const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null
  },  
  lastName: {
    type: String,
    default: null
  },
  profession: {
    type: String,
    default: null
  },
  socials: {
    type: Object,
    default: null,
  },
  img: {
    type: String,
    default: null,
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
