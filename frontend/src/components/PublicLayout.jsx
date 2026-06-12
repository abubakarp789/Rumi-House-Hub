import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <Navbar />
      <main id="main-content" className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
