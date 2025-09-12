import React from 'react'; 
import NavBarButton from '../common/NavbarButton';

//Baisc navbar with onClick function
const Navbar = () => {
  const handleButtonClick = (buttonName) => {
    alert(`${buttonName} was clicked!`);
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-center space-x-6">
          <NavBarButton text="Dashboard" onClick={() => handleButtonClick('Dashboard')} />
          <NavBarButton text="Menu" onClick={() => handleButtonClick('Menu')} />
          <NavBarButton text="Orders" onClick={() => handleButtonClick('Orders')} />
          <NavBarButton text="Tables" onClick={() => handleButtonClick('Tables')} />
          <NavBarButton text="Staff" onClick={() => handleButtonClick('Staff')} />
          <NavBarButton text="Reports" onClick={() => handleButtonClick('Reports')} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;