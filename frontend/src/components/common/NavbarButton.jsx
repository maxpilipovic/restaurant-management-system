import React from 'react';

//NavBar button
//Example of reusable component (button)
export const NavBarButton = ({ text, onClick }) => {
  return (
    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NavBarButton;