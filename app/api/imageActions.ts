'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';


const genai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);
const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function processImage(imagePart: string, additionalPrompt: string = "") {
    try {
        const result = await model.generateContent([
            `Identify this image and provide its name and important information including a detailed explanation about that image, your response should be in Turkish ${additionalPrompt}.`,
            JSON.parse(imagePart),
        ]);

        const text = result.response.text()
            .trim()
            .replace(/```/g, "")
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/-\s*/g, "")
            .replace(/\n\s*\n/g, "\n");

        return text;
    } catch (error) {
        console.error('Error in processImage:', error);
        throw new Error('Failed to process image');
    }
}

export async function generateKeywords(text: string) {
    try {
        const result = await model.generateContent([
            `Understand the text and generate important and unique meaningful Turkish keywords from the following text for social media tag. 
        Generate ONLY 6 keywords. Each keyword should be a single word or compound word.
        Response format should be: keyword1, keyword2, keyword3, keyword4, keyword5, keyword6
        Text: ${text}`,
        ]);

        const response = result.response.text()
            .trim()
            // Remove any markdown formatting
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            // Split by commas and clean up each keyword
            .split(',')
            .map(keyword =>
                keyword
                    .trim()
                    // Remove any remaining special characters
                    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, '')
                    // Convert multiple spaces to single space
                    .replace(/\s+/g, ' ')
                    // If it's a compound word, capitalize each part
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join('')
            )
            // Filter out empty strings and limit to 6 keywords
            .filter(keyword => keyword.length > 0)
            .slice(0, 6);

        return response;
    } catch (error) {
        console.error('Error in generateKeywords:', error);
        throw new Error('Failed to generate keywords');
    }
}

export async function generateRelatedQuestions(text: string) {
    try {
        const result = await model.generateContent([
            `Based on the following information about an image, generate 5 related questions in Turkish that someone might ask to learn more about the subject:
      ${text}
      Format the output as a simple list of questions, one per line.`,
        ]);

        return result.response.text().trim().split("\n");
    } catch (error) {
        console.error('Error in generateRelatedQuestions:', error);
        throw new Error('Failed to generate related questions');
    }
}