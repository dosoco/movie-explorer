import React from 'react'
import '../../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <h1 className="logo-text">Movie Explorer</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Favorites</a>
          <a href="#" className="nav-link">About</a>
        </nav>
      </div>
    </header>
  )
}

export default Header