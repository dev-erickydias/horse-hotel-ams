import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600">
            Get in touch with our team for inquiries and bookings
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-amber-800 mr-3" />
                <span>123 Stable Street, Amsterdam, Netherlands</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-amber-800 mr-3" />
                <span>+31 20 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-amber-800 mr-3" />
                <span>info@horsehotel.amsterdam</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.5344662844394!2d4.8339419!3d52.3779162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDIyJzQwLjUiTiA0wrA1MCcwMi4yIkU!5e0!3m2!1sen!2snl!4v1625764849849!5m2!1sen!2snl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;