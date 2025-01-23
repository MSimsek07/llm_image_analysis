import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-blue-50 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-[200px] sm:text-[300px] md:text-[400px] lg:text-[500px] xl:text-[600px] 
                              font-bold text-gray-400/30 select-none animate-pulse">
                    404
                </div>
            </div>
            <div className="z-10 text-center px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                    Sayfa Bulunamadı
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-6">
                    Aradığınız sayfa silinmiş veya taşınmış olabilir.
                </p>
                <Link href="/"
                    className="inline-block px-6 py-2 text-blue-600 border border-blue-600 
                               rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    Anasayfa&apos;ya dön
                </Link>
            </div>
        </main>
    );
}