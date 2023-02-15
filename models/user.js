const mongoose = require("mongoose");
const User = new mongoose.Schema({
  fullName: { type: String },
  dob: { type: Date },
  email: { type: String },
  phoneNumber: { type: String },
  profileImage: { type: String },
  password: { type: String },
});
module.exports = mongoose.model("User", User);
