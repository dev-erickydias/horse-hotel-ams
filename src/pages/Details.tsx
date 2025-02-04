import React from 'react';
import About from '../components/About';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import ExportDestinations from '../components/ExportDestinations';

const Details = () => {
  return (
    <div className="pt-20">
      <About />
      <Services />
      <Gallery />
      <ExportDestinations />
    </div>
  );
};

export default Details;