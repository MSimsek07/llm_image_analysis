import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, additionalPrompt } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const [result] = await genai.labelDetection(image);
    const labels = result.labelAnnotations;

    const description = labels.map(label => label.description).join(', ');

    res.status(200).json({ result: description });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Image analysis failed' });
  }
}
