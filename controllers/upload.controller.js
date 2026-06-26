import TravelDocument from "../models/TravelDocument.js";
import { analyzeTravelDocument } from "../services/gemini.service.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Extract data using Gemini
    const extractedData = await analyzeTravelDocument(req.file);

    // Save extracted document
    const travelDocument = await TravelDocument.create({
      user: req.user._id,
      originalFile: req.file.filename,
      documentType: extractedData.documentType,
      extractedData,
    });

    res.status(201).json({
      success: true,
      message: "Document analyzed and saved successfully",
      travelDocument,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};