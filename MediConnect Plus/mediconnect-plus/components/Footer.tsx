
import React from 'react';


//mt-auto: Pushes footer to the bottom
//container mx-auto: Centers content horizontally
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-4 text-center">
        <p>&copy; {new Date().getFullYear()} MediConnect Plus. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
