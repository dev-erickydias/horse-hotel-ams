import React from 'react';
import { Facebook, Instagram, Twitter, Users as Horse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Horse className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-xl font-semibold">Horse Hotel Amsterdam</span>
            </div>
            <p className="text-gray-400">
              Premium horse accommodation and transport services in the heart of Amsterdam
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition">About</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition">Services</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Accommodation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Transport</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Export</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Veterinary Care</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Horse Hotel Amsterdam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;