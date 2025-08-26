const mongoose = require("mongoose")

const sharedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  role: { 
    type: String, 
    enum: ["Owner", "Editor", "Viewer"], 
    required: true },
});

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sharedUsers: [sharedUserSchema],

    // lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Document", documentSchema);
