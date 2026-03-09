import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Pipeline from './components/Pipeline';
import Episode from './components/Episode';
import Consulting from './components/Consulting';
import Application from './components/Application';
import Vote from './components/Vote';
import Gallery from './components/Gallery';
import Episode1Detail from './components/Episode1Detail';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import ApplicantList from './admin/ApplicantList';
import VoteAdmin from './admin/VoteAdmin';
import GalleryAdmin from './admin/GalleryAdmin';
import './App.css';

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Application />
      <Intro />
      <Pipeline />
      <Episode />
      <Consulting />
      <Vote />
      {/* <Gallery /> */}
    </main>
    <footer>
      <div className="container footer-content">
        <div className="footer-logo">
          THE <span className="neon-text">NEXT</span> FELLOWSHIP
        </div>
        <div className="footer-right">
          <p>© 2026 인순이와 좋은 사람들. All rights reserved.</p>
          <Link to="/admin" className="admin-link">관리자 로그인</Link>
        </div>
      </div>
    </footer>
  </>
);

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Wrapping protected routes
  const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
    return isAdminLoggedIn ? (
      <AdminLayout>
        {children}
      </AdminLayout>
    ) : (
      <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
    );
  };

  return (
    <Router>
      <div className="app-loader">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/episode/1" element={<Episode1Detail />} />
          <Route path="/admin" element={<ProtectedAdmin><ApplicantList /></ProtectedAdmin>} />
          <Route path="/admin/vote" element={<ProtectedAdmin><VoteAdmin /></ProtectedAdmin>} />
          <Route path="/admin/gallery" element={<ProtectedAdmin><GalleryAdmin /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
