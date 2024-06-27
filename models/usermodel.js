const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
      type: String,
      unique: true
  },
  age: Number,
  jobTitle: String,
  industry: String,
  username: {
      type: String,
      unique: true
  },
  password: String,
  role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user"
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
      try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  });


  module.exports = mongoose.model('User', userSchema);
