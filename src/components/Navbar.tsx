import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <div className="logo">
          THE <span className="neon-text">NEXT</span> FELLOWSHIP
        </div>
        <div className="nav-links">
          <a href="#intro">소개</a>
          <a href="#episode">현재 회차</a>
          <a href="#vote">투표</a>
          <button className="cta-button-sticky">지금 나만의 경로 설계하기</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
