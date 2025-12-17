import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-black" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontSize: 32 }}>Digital Twins</span>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'text-black' : 'text-black/70'} hover:text-black transition-colors border-b-2 ${isActive ? 'border-black' : 'border-transparent'} pb-1`
              }
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 24 }}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${isActive ? 'text-black' : 'text-black/70'} hover:text-black transition-colors border-b-2 ${isActive ? 'border-black' : 'border-transparent'} pb-1`
              }
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 24 }}
            >
              Projects
            </NavLink>
            <NavLink
              to="/learning-hub"
              className={({ isActive }) =>
                `${isActive ? 'text-black' : 'text-black/70'} hover:text-black transition-colors border-b-2 ${isActive ? 'border-black' : 'border-transparent'} pb-1`
              }
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 24 }}
            >
              Learning Hub
            </NavLink>
            <NavLink
              to="/team"
              className={({ isActive }) =>
                `${isActive ? 'text-black' : 'text-black/70'} hover:text-black transition-colors border-b-2 ${isActive ? 'border-black' : 'border-transparent'} pb-1`
              }
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 24 }}
            >
              Team
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${isActive ? 'text-black' : 'text-black/70'} hover:text-black transition-colors border-b-2 ${isActive ? 'border-black' : 'border-transparent'} pb-1`
              }
              style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 24 }}
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

