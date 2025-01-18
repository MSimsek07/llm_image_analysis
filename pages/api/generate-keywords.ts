import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from '@google-cloud/vision';

const client = new google.vision.v1.ImageAnnotatorClient();

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
    const keywords = result.textAnnotations.map(annotation => annotation.description);

    res.status(200).json({ keywords });
  } catch (error) {
    console.error('Error generating keywords:', error);
    res.status(500).json({ error: 'Keyword generation failed' });
  }
}
