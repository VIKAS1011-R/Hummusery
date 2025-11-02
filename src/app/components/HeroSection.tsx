import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10 dark:from-black/40 dark:via-black/20 dark:to-black/40" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-orange-700 bg-clip-text text-transparent dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 mb-6 animate-fade-in">
          Experience Culinary Excellence
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
          Where every dish tells a story of passion and flavor, crafted with authentic Middle Eastern traditions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a 
            href="/menu" 
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
          >
            Explore Our Menu
          </a>
          <a 
            href="#contact" 
            className="bg-white/90 dark:bg-gray-800/90 text-orange-700 dark:text-orange-400 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg border border-orange-200 dark:border-orange-800 backdrop-blur-sm"
          >
            Visit Us Today
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
    </section>
  );
};

export default HeroSection;
