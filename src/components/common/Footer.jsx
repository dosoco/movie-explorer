import React from 'react'
import '../../styles/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>&copy; {currentYear} Movie Explorer</p>
          <p className="footer-note">Built with React & Vite</p>
        </div>
        
        <div className="api-credit">
          <p>Data provided by 
            <a href="http://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">
              OMDb API
            </a>
          </p>
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer