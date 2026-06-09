const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  skills: [String],

  education: String,

  experience: String,

  projects: [String],
});

module.exports = mongoose.model("CV", cvSchema);