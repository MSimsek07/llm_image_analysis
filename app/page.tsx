"use client";


import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MainContainer } from '@/components/main-container';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />
      {/* Main */}
      <MainContainer />
      {/* Footer */}
      <Footer />

    </div>
  );
}

export default HomePage;