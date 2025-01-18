import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
  throw new Error('Google Gemini API key is not set');
}

const genai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genai.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
      `Understand the text and generate important and unique meaningful Turkish keywords from the following text for social media tag: ${text} DO NOT write anything else just words no punctuation or special characters.`,
    ]);

    const response = result.response;
    const keywords = response
      .text()
      .trim()
      .split(/\s+/)
      .slice(0, 6); // Assuming the response is a space-separated string of keywords

    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Keyword generation failed' });
  }
}
