import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            THE <span className="neon-text">NEXT</span> FELLOWSHIP
          </Link>
        </div>

        <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <a href="/#intro" onClick={closeMobileMenu}>소개</a>
          <a href="/#episode" onClick={closeMobileMenu}>현재 회차</a>
          <a href="/#vote" onClick={closeMobileMenu}>주제신청</a>
          <Link to="/staff" onClick={closeMobileMenu}>운영팀소개</Link>
          <a href="/#application" className="cta-button-sticky" style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>참가신청하기</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
