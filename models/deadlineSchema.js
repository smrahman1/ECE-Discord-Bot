const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema({
  courseCode: { type: String, require: true },
  deadlineCount: { type: Number, require: true },
  deadlineArray: { type: Array, require: true },
});

const model = mongoose.model("Deadline", deadlineSchema);

module.exports = model;
