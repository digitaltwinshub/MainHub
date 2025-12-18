import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkBase = ({ isActive }) =>
    `${isActive ? 'text-black' : 'text-black/70'} hover:text-black transition-colors border-b-2 ${isActive ? 'border-black' : 'border-transparent'} pb-1`;

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <span
              className="font-bold text-black truncate"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}
            >
              <span className="text-xl sm:text-2xl">Digital Twins</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 20 }}>
              Home
            </NavLink>
            <NavLink to="/projects" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 20 }}>
              Projects
            </NavLink>
            <NavLink to="/learning-hub" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 20 }}>
              Learning Hub
            </NavLink>
            <NavLink to="/team" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 20 }}>
              Team
            </NavLink>
            <NavLink to="/contact" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 20 }}>
              Contact
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-black"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-sm" style={{ fontFamily: 'Poppins, ui-sans-serif' }}>
              Menu
            </span>
          </button>
        </div>

        {/* Mobile links */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-white border border-black/10 p-4">
              <NavLink to="/" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 18 }} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/projects" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 18 }} onClick={() => setOpen(false)}>
                Projects
              </NavLink>
              <NavLink to="/learning-hub" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 18 }} onClick={() => setOpen(false)}>
                Learning Hub
              </NavLink>
              <NavLink to="/team" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 18 }} onClick={() => setOpen(false)}>
                Team
              </NavLink>
              <NavLink to="/contact" className={linkBase} style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui', fontSize: 18 }} onClick={() => setOpen(false)}>
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
