import "./config/env.js";
import fs from "fs";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Create uploads folder automatically
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});