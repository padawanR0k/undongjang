import type { Request, Response } from "express";
import { analyzeDogImages } from "../services/googleAI";

export async function analyzeHandler(req: Request, res: Response) {
	try {
		// Get text from request body
		const { text } = req.body;

		// Validate text

		if (text.length > 100) {
			return res
				.status(400)
				.json({ error: "텍스트는 100자를 초과할 수 없습니다" });
		}

		// Get uploaded files
		const files = req.files.files;

		if (!files || files.length === 0) {
			return res
				.status(400)
				.json({ error: "최소 1장의 강아지 사진이 필요합니다" });
		}

		if (files.length > 3) {
			return res
				.status(400)
				.json({ error: "최대 3장의 강아지 사진만 업로드할 수 있습니다" });
		}
    console.log(files)
		// Get file paths
		const imagePaths = files.map((file) => file.path);

		// Analyze dog images
		const result = await analyzeDogImages(text, imagePaths);

		// Return results
		return res.json(result);
	} catch (error) {
		console.error("Analysis error:", error);
		return res.status(500).json({ error: "이미지 분석에 실패했습니다" });
	}
}
