import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-retiro-cream to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-noto-kr font-semibold text-retiro-dark mb-6 animate-fade-in">
          Authentic Japanese Flavors, Perfect Ramen Bowls
          <span className="block text-retiro-red mt-2">RETIRO RICE & RAMEN</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          Handcrafted broths, springy noodles, Korean street-food favorites.
        </p>
        <div className="flex justify-center">
          <a 
            href="#menu"
            className="bg-retiro-red text-white px-8 py-3 rounded-full hover:bg-retiro-kimchi transition-all duration-300 transform hover:scale-105 font-medium"
          >
            Explore Menu
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;