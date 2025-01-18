import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
      `Based on the following information about an image, generate 5 related questions in Turkish that someone might ask to learn more about the subject :
      
      ${text}
      
      Format the output as a simple list of questions, one per line.`,
    ]);

    const response = await result.response;
    const questions = response.text().trim().split("\n");

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error generating related questions:', error);
    res.status(500).json({ error: 'Related questions generation failed' });
  }
}
