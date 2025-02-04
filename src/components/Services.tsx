import React from 'react';
import { Home, Truck, FileCheck } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Luxury Accommodation",
      description: "State-of-the-art stables with 24/7 monitoring, premium feeding programs, and dedicated care staff."
    },
    {
      icon: Truck,
      title: "Professional Transport",
      description: "Safe and comfortable transportation services across Europe and worldwide, with experienced handlers."
    },
    {
      icon: FileCheck,
      title: "Export Services",
      description: "Complete export preparation including documentation, health certificates, and customs clearance."
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">
            Comprehensive care and logistics solutions for your horses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service) => (
            <div key={service.title} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <service.icon className="h-12 w-12 text-amber-800 mb-6 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;