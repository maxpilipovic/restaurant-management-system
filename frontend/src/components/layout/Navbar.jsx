import React from 'react'; 
import NavBarButton from '../common/NavbarButton';
import { Navigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

//I'D LIKE to HAVE A NAVBAR FOR ONLY ADMINS. Normal users don't get navbar and go direcrtly to their page.
//Baisc navbar with onClick function
const Navbar = () => {
  const navigate = useNavigate();
  const { user,loading,  signOut } = useAuth();

  

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

  if (loading) {
    return (
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  if (!user) {
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

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
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
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.email}
            </span>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;