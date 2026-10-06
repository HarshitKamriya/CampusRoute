import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map } from 'lucide-react';

const Navbar = ({ onOpenMapModal }) => {
  return (
    <header className="navbar-container">
      <nav className="navbar">
        <NavLink to="/" className="brand-group">
          <div className="brand-crest">CR</div>
          <div className="brand-text-block">
            <span className="brand-title">CampusRoute</span>
            <span className="brand-subtitle">NIT Srinagar</span>
          </div>
        </NavLink>

        <div className="nav-controls">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Route Finder
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            History
          </NavLink>
          {onOpenMapModal && (
            <button type="button" className="nav-btn-map" onClick={onOpenMapModal}>
              <Map size={15} />
              <span>Campus Map</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
