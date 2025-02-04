import React from 'react';

const Gallery = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Luxury stable interior"
    },
    {
      url: "https://images.unsplash.com/photo-1566251037378-5e04e3bec343?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Horse transport vehicle"
    },
    {
      url: "https://images.unsplash.com/photo-1599053581540-248ea75b59cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Training facility"
    },
    {
      url: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Horse care"
    },
    {
      url: "https://images.unsplash.com/photo-1551884831-7d3b6feb505b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Outdoor arena"
    },
    {
      url: "https://images.unsplash.com/photo-1566068256639-2f046b164a98?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Veterinary facilities"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h2>
          <p className="text-lg text-gray-600">
            Take a tour of our world-class facilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;