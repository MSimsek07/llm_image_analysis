import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
  throw new Error('Google Gemini API key is not set');
}

const genai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(",")[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type
        }
      });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, additionalPrompt } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const model = genai.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const imageParts = await fileToGenerativePart(image);
    const result = await model.generateContent([
      `Identify this image and provide its name and important information including a detailed explanation about that image, your response should be in Turkish ${additionalPrompt}.`,
      imageParts,
    ]);

    const response = result.response;
    const text = response
      .text()
      .trim()
      .replace(/```/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/-\s*/g, "")
      .replace(/\n\s*\n/g, "\n");

    res.status(200).json({ result: text });
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    res.status(500).json({ error: `Image analysis failed: ${error.message}` });
  }
}
