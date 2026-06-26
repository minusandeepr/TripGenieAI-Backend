import crypto from "crypto";

import TravelDocument from "../models/TravelDocument.js";
import Itinerary from "../models/Itinerary.js";

import { generateItinerary } from "../services/itinerary.service.js";

export const createItinerary = async (req, res) => {
  try {
    const { travelDocumentId } = req.body;

    if (!travelDocumentId) {
      return res.status(400).json({
        success: false,
        message: "Travel document ID is required",
      });
    }

    // Find uploaded travel document
    const travelDocument = await TravelDocument.findById(travelDocumentId);

    if (!travelDocument) {
      return res.status(404).json({
        success: false,
        message: "Travel document not found",
      });
    }

    // Generate itinerary using Gemini
    const generatedItinerary = await generateItinerary(
      travelDocument.extractedData
    );

    // Save itinerary
    const itinerary = await Itinerary.create({
      user: travelDocument.user,
      travelDocument: travelDocument._id,
      title: generatedItinerary.title || "My Trip",
      destination: generatedItinerary.destination || "",
      itinerary: generatedItinerary,
      shareId: crypto.randomUUID(),
    });

    res.status(201).json({
      success: true,
      message: "Itinerary generated successfully",
      itinerary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({
      user: req.user._id,
    })
      .populate("travelDocument")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: itineraries.length,
      itineraries,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate("travelDocument");

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSharedItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      shareId: req.params.shareId,
    }).populate("travelDocument");

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Shared itinerary not found",
      });
    }

    res.status(200).json({
      success: true,
      itinerary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    if (itinerary.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      message: "Itinerary deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};