import { processImage, generateKeywords, generateRelatedQuestions } from '../app/api/imageActions';
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Image Actions', () => {
    test('processImage should return a result', async () => {
        const imagePart = 'base64ImageData';
        const result = await processImage(imagePart);
        expect(result).toBeDefined();
    });

    test('generateKeywords should return an array of keywords', async () => {
        const text = 'sample text';
        const keywords = await generateKeywords(text);
        expect(Array.isArray(keywords)).toBe(true);
    });

    test('generateRelatedQuestions should return an array of questions', async () => {
        const text = 'sample text';
        const questions = await generateRelatedQuestions(text);
        expect(Array.isArray(questions)).toBe(true);
    });
});