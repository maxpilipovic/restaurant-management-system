//import './App.css'
import Navbar from './components/layout/Navbar'
import { Routes, Route } from 'react-router-dom';
import PageAdmin from './pages/PageAdmin';
import PageChef from './pages/PageChef';
import PageHost from './pages/PageHost';
import PageManager from './pages/PageManager';
import PageOwner from './pages/PageOwner';
import PageWaiter from './pages/PageWaiter';
import Home from './pages/Home';
function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<PageHost />} />
        <Route path="/admin" element={<PageAdmin />} />
        <Route path="/chef" element={<PageChef />} />
        <Route path="/waiter" element={<PageWaiter />} />
        <Route path="/manager" element={<PageManager />} />
        <Route path="/owner" element={<PageOwner />} />
      </Routes>
    </>
  )
}

export default App
