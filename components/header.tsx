"use client"
import Link from 'next/link'
import Image from 'next/image'
import ImageAsset from '../public/logo.png'
import { useCallback } from 'react'

export const Header = () => {
    const slowScroll = useCallback((targetElem: HTMLElement) => {
        const startY = window.pageYOffset
        const endY = targetElem.offsetTop
        const distance = endY - startY
        const duration = 2000
        let startTime: number | null = null

        function easeInOutCubic(t: number) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2
        }

        function step(currentTime: number) {
            if (!startTime) startTime = currentTime
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            window.scrollTo(0, startY + distance * easeInOutCubic(progress))
            if (elapsed < duration) requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
    }, [])

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        const href = e.currentTarget.href
        if (href.includes('#')) {
            const targetId = href.split('#')[1]
            const elem = document.getElementById(targetId)
            if (elem) slowScroll(elem)
        }
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src={ImageAsset} alt="Logo" width={40} height={40} className="mr-3" />
                        <h1 className="text-2xl font-bold text-blue-600">LLM RESİM ANALİZ UYGULAMASI</h1>
                    </Link>
                    <nav>
                        <ul className="flex items-center space-x-6">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out">
                                    Anasayfa
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#how-it-works"
                                    onClick={handleScroll}
                                    className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
                                >
                                    Nasıl Çalışır
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#features"
                                    onClick={handleScroll}
                                    className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
                                >
                                    Özellikler
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}