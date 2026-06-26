import mongoose from "mongoose";

const travelDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalFile: {
      type: String,
      required: true,
    },

    documentType: {
      type: String,
      default: "",
    },

    extractedData: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TravelDocument", travelDocumentSchema);