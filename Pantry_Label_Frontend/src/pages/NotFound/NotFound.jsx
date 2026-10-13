import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../../components/Header/Header';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="notfound-page-container">
      <Header />
      
      <main className="notfound-content">
        <div className="notfound-card">
          <span className="notfound-emoji" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={40} color="#94a3b8" />
          </span>
          <h2>404 - Page Not Found</h2>
          <p>The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="notfound-home-btn">
            Go to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
