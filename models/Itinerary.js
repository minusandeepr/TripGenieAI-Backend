import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    travelDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelDocument",
      required: true,
    },

    title: {
      type: String,
      default: "My Trip",
    },

    destination: String,

    itinerary: {
      type: Object,
      required: true,
    },

    shareId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Itinerary", itinerarySchema);