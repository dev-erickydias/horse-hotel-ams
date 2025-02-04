import React from 'react';
import { MapPin } from 'lucide-react';

const ExportDestinations = () => {
  const destinations = [
    "Argentina", "Bahrain", "Canada", "China", "Costa Rica", "Ecuador", "India",
    "Ivory Coast", "Korea", "Kuwait", "Malaysia", "Mexico", "Oman", "Pakistan",
    "Peru", "Qatar", "Russia", "Taiwan", "Thailand", "Uruguay", "UAE", "USA",
    "Vietnam", "South Africa"
  ];

  return (
    <section id="destinations" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Export Destinations</h2>
          <p className="text-lg text-gray-600">
            We facilitate horse transport and export to destinations worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {destinations.map((destination) => (
            <div
              key={destination}
              className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <MapPin className="h-4 w-4 text-amber-800 mr-2" />
              <span className="text-gray-700">{destination}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExportDestinations;