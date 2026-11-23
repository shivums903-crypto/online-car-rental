import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <NavLink to="/" className="logo">DriveEasy</NavLink>
        <nav>
          <NavLink to="/">Cars</NavLink>
          {user && <NavLink to="/bookings">My bookings</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          {user ? (
            <button className="link" onClick={() => { logout(); nav('/'); }}>
              Log out ({user.name.split(' ')[0]})
            </button>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register" className="btn small">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
