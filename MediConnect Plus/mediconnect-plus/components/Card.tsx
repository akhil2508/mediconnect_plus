
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}


// ? means optional 
// ${} is used for concatenate in class (called as temporal string)


const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl ${className}`}>
      {title && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;

// Other components can import only when we export
