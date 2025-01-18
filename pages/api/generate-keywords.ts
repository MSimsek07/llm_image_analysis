import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const [result] = await client.labelDetection(text);
    const keywords = result.labelAnnotations.map(annotation => annotation.description);

    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Keyword generation failed' });
  }
}
