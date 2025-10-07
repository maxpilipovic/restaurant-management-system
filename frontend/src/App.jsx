//import './App.css'
import Navbar from './components/layout/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom';
import PageAdmin from './pages/PageAdmin';
import PageChef from './pages/PageChef';
import PageHost from './pages/PageHost';
import PageManager from './pages/PageManager';
import PageOwner from './pages/PageOwner';
import PageWaiter from './pages/PageWaiter';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import { AuthProvider } from './contexts/AuthContext';

import CreateOrder from './pages/CreateOrder';
import LoginForm from './pages/LoginForm';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/'; //Temp fix to hide navbar on login page

  return (
    <>
     <AuthProvider>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/home" element={<Home />} />
        <Route path="/host" element={<PageHost />} />
        <Route path="/admin" element={<PageAdmin />} />
        <Route path="/chef" element={<PageChef />} />
        <Route path="/waiter" element={<PageWaiter />} />
        <Route path="/manager" element={<PageManager />} />
        <Route path="/owner" element={<PageOwner />} />
        <Route path="/create-order" element={<CreateOrder />} /> 
      </Routes>
    </AuthProvider>
      {/* import toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App;
