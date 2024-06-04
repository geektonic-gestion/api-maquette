const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  figmaToken: { type: String, required: true },
  role: { type: String, required: true, enum: ["invité", "admin"] },
  teamId: { type: String, required: false },
});

module.exports = mongoose.model("User", userSchema);
