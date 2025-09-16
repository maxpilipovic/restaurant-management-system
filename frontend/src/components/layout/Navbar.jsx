import React from 'react'; 
import NavBarButton from '../common/NavbarButton';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

//Baisc navbar with onClick function
const Navbar = () => {

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-center space-x-6">
          <Link to="/login">
            <NavBarButton text="Login" />
          </Link>
          <Link to="/admin">
            <NavBarButton text="Admin" />
          </Link>
          <Link to="/chef">
            <NavBarButton text="Chef" />
          </Link>
          <Link to="/host">
            <NavBarButton text="Host" />
          </Link>
          <Link to="/manager">
            <NavBarButton text="Manager" />
          </Link>
          <Link to="/owner">
            <NavBarButton text="Owner" />
          </Link>
          <Link to="/waiter">
            <NavBarButton text="Waiter" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;