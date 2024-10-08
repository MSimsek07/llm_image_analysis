"use-client"
import Link from 'next/link'
import Image from 'next/image'
import ImageAsset from '../public/logo.png'


export const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className=" flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image src={ImageAsset} alt="Logo" width={40} height={40} className="mr-3 " />
                        <h1 className="text-2xl font-bold text-blue-600"> LLM RESİM ANALİZ UYGULAMASI</h1>
                    </div>
                    {/* Menus */}
                    <nav>
                        <ul className="flex items-center space-x-6">
                            <Link href={"#"} className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">Anasayfa</Link>
                            <Link href={"#how-it-works"} className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">Nasıl Çalışır</Link>
                            <Link href={"#features"} className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"> Özellikler</Link>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}