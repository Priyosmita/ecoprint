// FloatingHeader.jsx
import React from 'react';

const Header = ({ title, actions }) => {
  return (
    <div className="fixed top-5 left-1/2 w-3/4 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 flex items-center z-50 text-black bg-opacity-50">
      <h1 className="m-0 text-xl font-bold">{title}</h1>
      <div className="ml-auto flex items-center space-x-4">
        {actions}
      </div>
    </div>
  );
};

export default Header;
