"use-client";

import React, { useState } from 'react'
import Image from 'next/image'

export const MainContainer = () => {
    const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [result, setresult] = useState<string | null>(null)
    const [loading, setloading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const identifyImage = async (additionalPrompt: string = "") => {
        if (!image) return;
        setloading(true);

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('additionalPrompt', additionalPrompt);

            const response = await fetch('/api/identify-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image analysis failed');
            }

            const data = await response.json();
            const text = data.result;

            setresult(text);
            await generateKeywords(text);
            await generateRelatedQuestions(text);
        } catch (error) {
            console.log((error as Error)?.message);
        } finally {
            setloading(false);
        }
    };

    const generateKeywords = async (text: string) => {
        setloading(true);

        try {
            const response = await fetch('/api/generate-keywords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Keyword generation failed');
            }

            const data = await response.json();
            const keywords = data.keywords;

            setKeywords(keywords);
        } catch (error) {
            console.log((error as Error)?.message);
        } finally {
            setloading(false);
        }
    };

    const regenerateContent = (keyword: string) => {
        identifyImage(`Focus more on aspects related to "${keyword}".`);
    };

    const generateRelatedQuestions = async (text: string) => {
        try {
            const response = await fetch('/api/generate-related-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Related questions generation failed');
            }

            const data = await response.json();
            const questions = data.questions;

            setRelatedQuestions(questions);
        } catch (error) {
            console.error("Error generating related questions:", error);
            setRelatedQuestions([]);
        }
    };

    const askRelatedQuestion = (question: string) => {
        identifyImage(
            `Answer the following question about the image in Turkish DONT write the questions itself, also you dont need to write about the image from scracth just focus the question and ONLY write the answer: "${question}"`
        );
    };

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
                    <div className='p-8 '>
                        <h2 className=' text-3xl font-extrabold text-gray-800 mb-8 text-center'> Resimlerinizi Yapay Zeka ile İnceleyin</h2>
                        <div className='mb-8'>
                            <label htmlFor="image-upload" className='block text-sm font-medium text-gray-700 mb-2'> Resim Yükleyiniz</label>
                        </div>
                        <input type="file" id='image-upload' accept='image/*' onChange={handleImageUpload} className='block w-full text-sm to-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out' />
                    </div>
                    {/*display the image*/}
                    {image && (
                        <div className='mb-8 flex justify-center'>
                            <Image src={URL.createObjectURL(image)} alt='resim' width={350} height={350} className='rounded-lg shadow-md ' />
                        </div>
                    )}

                    <button onClick={() => identifyImage()} type='button' disabled={!image || loading} className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg'> {loading ? "İnceleniyor.." : "Resimi incele"} </button>

                </div>

                <div>
                    {result && (
                        <div className='bg-blue-50 p-8 mt-3  border-t border-blue-100'>
                            <h3 className='text-2xl font-bold text-gray-800'>Sonuç</h3>
                            <p className='text-lg text-gray-600 mt-4'>{result}</p>
                        </div>
                    )}
                </div>

                <div className='mt-6'>
                    <h4 className='text-lg font-semibold mb-2 text-blue-500'> İlgili Anahtar Kelimeler</h4>
                    <div className='flex flex-wrap gap-2'>
                        {keywords.map((keyword, index) => (
                            <button type="button" key={index} onClick={() => regenerateContent(keyword)} className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 transition duration-150 ease-in-out'>{keyword}</button>
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
                                                : step === "Sonuçları İnceleyin"
                                                    ? "Son olarak, modelimiz resmin içeriği hakkında ayrıntılı bilgiler sunar."
                                                    : ""}

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
                            "Kullanıcı Dostu Arayüz",
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
                                                : feature === "Kullanıcı Dostu Arayüz"
                                                    ? "Kullanıcı dostu arayüzü ile kolay kullanım sunar."
                                                    : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>


            </main>


        </>
    );
}
