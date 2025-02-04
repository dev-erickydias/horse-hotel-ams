import React, { useState } from 'react';
import { Menu, X, Users as Horse } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Horse className="h-8 w-8 text-amber-800" />
            <span className="ml-2 text-xl font-semibold text-amber-900">Horse Hotel Amsterdam</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-amber-800 transition">Home</a>
            <a href="#about" className="text-gray-700 hover:text-amber-800 transition">About</a>
            <a href="#services" className="text-gray-700 hover:text-amber-800 transition">Services</a>
            <a href="#gallery" className="text-gray-700 hover:text-amber-800 transition">Gallery</a>
            <a href="#destinations" className="text-gray-700 hover:text-amber-800 transition">Destinations</a>
            <a href="#contact" className="text-gray-700 hover:text-amber-800 transition">Contact</a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-amber-800">Home</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-amber-800">About</a>
            <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-amber-800">Services</a>
            <a href="#gallery" className="block px-3 py-2 text-gray-700 hover:text-amber-800">Gallery</a>
            <a href="#destinations" className="block px-3 py-2 text-gray-700 hover:text-amber-800">Destinations</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-amber-800">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;