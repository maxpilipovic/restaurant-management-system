import React from 'react'; 
import { useEffect, useState } from 'react';
import NavBarButton from '../common/NavbarButton';
//import { Navigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

//I'D LIKE to HAVE A NAVBAR FOR ONLY ADMINS. Normal users don't get navbar and go direcrtly to their page.
//Baisc navbar with onClick function
const Navbar = () => {
  const navigate = useNavigate();
  const { user,  signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false); 
  const [checkedAccess, setCheckedAccess] = useState(false);

  //useEffect to pull data
  useEffect(() => {
    
    //Check if metadata exists
    if (!user) {
      console.log("NO USER");
      return;
    }

    const checkAccess = async () => {
      try {
        const workersResponse = await fetch('http://localhost:3001/api/users');
        const workersData = await workersResponse.json();

        const currentUser = workersData.find(w => w.email === user.user_metadata.email);

        //Check if host or admin
        //Host is 2?
        if (currentUser && currentUser.role_id === 6) {
          setIsAdmin(true);

        }
        else  {
          setIsAdmin(false);
          console.log("NOT AN ADMIN");
        }
      } catch (error) {
        console.error("Error checking access for ADMIN PAGE", error);
      }
      finally{
        setCheckedAccess(true);
      }
    };

    checkAccess();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();    
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user || !checkedAccess) {
    return (
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  //AI GENERATED A NEW NAVBAR FOR ADMINS.
  if (isAdmin) {
    return (
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          {/* Left Side */}
          <div className="flex items-center space-x-6">
            <Link to="/admin">
              <NavBarButton text="Dashboard" />
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

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-100 font-medium">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition transform active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // ---------- NON-ADMIN NAVBAR ----------
  return (
    <nav className="bg-gray-100 border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center">
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition transform active:scale-95"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;