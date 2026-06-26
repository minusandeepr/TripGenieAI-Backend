import express from "express";

import upload from "../middleware/upload.middleware.js";
import protect from "../middleware/auth.middleware.js";

import { uploadDocument } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("document"),
  uploadDocument
);

export default router;