import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

export interface DogAnalysisResult {
  breed: string;
  size: string;
  fur_type: string;
  fur_color: string;
  unique_features: string;
}

const instruction = `
  너는 사육사 10년차야
  요구사항
  - 제공된 강아지 사진 분석
  - 최대한 자세하게 특징 분석
  - 응답은 한글로
`

export async function analyzeDogImages(textPrompt: string, imagePaths: string[]): Promise<DogAnalysisResult> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw new Error('Google AI API key is not configured');
    }

    // Read and encode images to base64
    const base64Images = await Promise.all(
      imagePaths.map(async (path) => {
        const imageBuffer = await readFileAsync(path);
        return imageBuffer.toString('base64');
      })
    );

    // Prepare request parts
    const parts = [
      {
        text: `${instruction}. 다음 JSON 형식으로 특성을 반환하세요: { 'breed': 'string', 'size': 'string', 'fur_type': 'string', 'fur_color': 'string', 'unique_features': 'string' }. 추가로 다음 정보도 고려하세요: ${textPrompt}`
      }
    ];

    // Add images to parts
    base64Images.forEach(imageBase64 => {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64
        }
      });
    });

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts
        }
      ]
    };

    // Make API request to Google AI Studio
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Extract and parse the response
    const generatedText = response.data.candidates[0].content.parts[0].text;

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[^]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from the API response');
    }

    const resultJson = JSON.parse(jsonMatch[0].replace(/'/g, '"'));

    return resultJson as DogAnalysisResult;
  } catch (error) {
    console.error('Error analyzing dog images:', error);
    throw error;
  }
}
