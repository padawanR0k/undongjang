import { log } from "@repo/logger";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { createServer } from "./server";

// Load environment variables
dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const port = process.env.PORT || 5001;
const server = createServer();


server.listen(port, () => {
  log(`api running on ${port}`);
});
