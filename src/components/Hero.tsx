import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <div id="home" className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Horse Hotel Amsterdam</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Luxury accommodation and professional transport services for your equine companions
        </p>
        <a
          href="#about"
          className="bg-amber-800 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition"
        >
          Discover More
        </a>
        
        <div className="absolute bottom-8 animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export default Hero;