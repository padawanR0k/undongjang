import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { type Express } from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { analyzeHandler } from "./controllers/analyzeController";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    // 다양한 필드 이름을 받을 수 있게 처리 방법 1: fields 사용
    .post("/analyze", upload.fields([
      { name: 'files', maxCount: 3 },  // 일반적인 파일 필드명
    ]), analyzeHandler);

  // 또는 대안으로 any() 사용 (보안상 덜 권장됨)
  // .post("/analyze", upload.any(), analyzeHandler);

  return app;
};
