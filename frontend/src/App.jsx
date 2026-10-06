import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import RouteHistory from './pages/RouteHistory.jsx';
import CampusMapModal from './components/CampusMapModal.jsx';

function App() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onOpenMapModal={() => setIsMapModalOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<RouteHistory />} />
      </Routes>

      <CampusMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}

export default App;
