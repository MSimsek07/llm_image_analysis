'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { processImage, generateKeywords, generateRelatedQuestions } from '../app/api/imageActions';
import { Toaster, toast } from 'react-hot-toast';

export const MainContainer = () => {
    const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            toast.success('Resim başarıyla yüklendi!');
        }
    };

    const fileToGenerativePart = async (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result as string;
                const base64Content = base64Data.split(",")[1];
                resolve(JSON.stringify({
                    inlineData: {
                        data: base64Content,
                        mimeType: file.type
                    }
                }));
            };
            reader.onerror = (error) => {
                toast.error('Resim yüklenirken hata oluştu');
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };

    const identifyImage = async (additionalPrompt: string = "") => {
        if (!image) {
            toast.error('Lütfen bir resim yükleyin.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Resim işleniyor...');

        try {
            const imagePart = await fileToGenerativePart(image);
            const text = await processImage(imagePart as string, additionalPrompt);
            setResult(text);

            const newKeywords = await generateKeywords(text);
            setKeywords(newKeywords);

            const newQuestions = await generateRelatedQuestions(text);
            setRelatedQuestions(newQuestions);

            toast.success('Resim başarıyla analiz edildi!', { id: toastId });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Analiz sırasında bir hata oluştu, lütfen büyük boyutlu görüntüler, gifler kullanmayınız!', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const regenerateContent = (keyword: string) => {
        toast(`"${keyword}" ile ilgili daha fazla bilgi aranıyor...`);
        identifyImage(`Focus more on aspects related to "${keyword}", no need to write all the previous information just write keyword related aspects only.`);
    };

    const askRelatedQuestion = (question: string) => {
        toast(`"${question}" sorusu cevaplanıyor...`);
        identifyImage(
            `Answer the following question about the image in Turkish DONT write the questions itself, also you dont need to write about the image from scratch just focus the question and ONLY write the answer: "${question}"`
        );
    };

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#374151',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        zIndex: 9999,
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        maxWidth: '500px'
                    },
                    success: {
                        style: {
                            background: '#ecfdf5',
                            border: '1px solid #059669',
                            color: '#065f46'
                        }
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            border: '1px solid #dc2626',
                            color: '#991b1b'
                        }
                    },
                    loading: {
                        style: {
                            background: '#eff6ff',
                            border: '1px solid #2563eb',
                            color: '#1e40af'
                        }
                    }
                }}
            />

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
                    <div className='p-8 '>
                        <h2 className='text-3xl font-extrabold text-gray-800 mb-8 text-center'>
                            Resimlerinizi Yapay Zeka ile İnceleyin
                        </h2>
                        <div className='mb-8'>
                            <label htmlFor="image-upload" className='block text-sm font-medium text-gray-700 mb-2'>
                                Resim Yükleyiniz
                            </label>
                        </div>
                        <input
                            type="file"
                            id='image-upload'
                            accept='image/*'
                            onChange={handleImageUpload}
                            className='block w-full text-sm to-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out'
                        />
                    </div>

                    {image && (
                        <div className='mb-8 flex justify-center'>
                            <Image
                                src={URL.createObjectURL(image)}
                                alt='resim'
                                width={350}
                                height={350}
                                className='rounded-lg shadow-md'
                            />
                        </div>
                    )}

                    <button
                        onClick={() => identifyImage()}
                        type='button'
                        disabled={!image || loading}
                        className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg'
                    >
                        {loading ? "İnceleniyor.." : "Resimi incele"}
                    </button>
                </div>

                {result && (
                    <div className='bg-blue-50 p-8 mt-3 border-t border-blue-100'>
                        <h3 className='text-2xl font-bold text-gray-800'>Sonuç</h3>
                        <p className='text-lg text-gray-600 mt-4'>{result}</p>
                    </div>
                )}

                <div className='mt-6'>
                    <h4 className='text-lg font-semibold mb-2 text-blue-500'>
                        İlgili Anahtar Kelimeler
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                        {keywords.map((keyword, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => regenerateContent(keyword)}
                                className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 transition duration-150 ease-in-out'
                            >
                                {keyword}
                            </button>
                        ))}
                    </div>
                </div>

                {relatedQuestions.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-2 text-blue-700">
                            İlgili Sorular:
                        </h4>
                        <ul className="space-y-2">
                            {relatedQuestions.map((question, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => askRelatedQuestion(question)}
                                        className="text-left w-full bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition duration-150 ease-in-out"
                                    >
                                        {question}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <section id="how-it-works" className="mt-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                        Nasıl Çalışır?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {["Resim Yükleme", "Yapay Zeka Analizi", "Sonuçları İnceleyin"].map(
                            (step, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <div className="text-3xl font-bold text-blue-600 mb-4">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                        {step}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step === "Resim Yükleme"
                                            ? "İlk olarak, resminizi yükleyin."
                                            : step === "Yapay Zeka Analizi"
                                                ? "Yapay zeka modelimiz resmi analiz eder ve içeriği tanımlar."
                                                : "Son olarak, modelimiz resmin içeriği hakkında ayrıntılı bilgiler sunar."}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section id="features" className="mt-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                        Özellikler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            "Doğru Tanımlama",
                            "Detaylı Bilgi",
                            "Hızlı Sonuçlar",
                            "Gizlilik",
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                                    {feature}
                                </h3>
                                <p className="text-gray-600">
                                    {feature === "Doğru Tanımlama"
                                        ? "Resimlerinizi doğru bir şekilde tanımlar."
                                        : feature === "Detaylı Bilgi"
                                            ? "Resimler hakkında detaylı bilgi sağlar."
                                            : feature === "Hızlı Sonuçlar"
                                                ? "Hızlı ve etkili sonuçlar sunar."
                                                : " Resimleri depolamaz ve gizliliğinizi korur."}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};