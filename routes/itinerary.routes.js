
import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  getSharedItinerary,
  deleteItinerary,
} from "../controllers/itinerary.controller.js";

const router = express.Router();

// Generate itinerary
router.post("/", protect, createItinerary);
// Logged in user's itineraries
router.get("/", protect, getUserItineraries);

router.get("/share/:shareId", getSharedItinerary);

router.get("/:id", protect, getItineraryById);

router.delete("/:id", protect, deleteItinerary);

export default router;

