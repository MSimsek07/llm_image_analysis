import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const [result] = await client.documentTextDetection(text);
    const questions = result.textAnnotations.map(annotation => annotation.description);

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Error generating related questions:', error);
    res.status(500).json({ error: 'Related questions generation failed' });
  }
}
