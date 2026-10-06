import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark">C</span>
        <span>CampusRoute</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/history">History</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
