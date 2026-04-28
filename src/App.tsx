import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { getAdminToken, clearAdminToken } from './utils/apiClient';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Pipeline from './components/Pipeline';
import Episode from './components/Episode';
import Consulting from './components/Consulting';
import Application from './components/Application';
import Vote from './components/Vote';
import Episode1Detail from './components/Episode1Detail';
import Episode2Detail from './components/Episode2Detail';
import Staff from './components/Staff';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import ApplicantList from './admin/ApplicantList';
import VoteAdmin from './admin/VoteAdmin';
import GalleryAdmin from './admin/GalleryAdmin';
import Dashboard from './admin/Dashboard';
import MentorSurveyAdmin from './admin/MentorSurveyAdmin';
import MentorSurvey from './components/MentorSurvey';
import MentorBanner from './components/MentorBanner';
import './App.css';

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Application />
      <Episode />
      <Intro />
      <Pipeline />
      <Consulting />
      <Vote />
      <MentorBanner />
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!getAdminToken());

  const handleLogin = () => setIsAdminLoggedIn(true);

  const handleLogout = () => {
    clearAdminToken();
    setIsAdminLoggedIn(false);
  };

  const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
    return isAdminLoggedIn ? (
      <AdminLayout onLogout={handleLogout}>
        {children}
      </AdminLayout>
    ) : (
      <AdminLogin onLogin={handleLogin} />
    );
  };

  return (
    <Router>
      <div className="app-loader">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/episode/1" element={<Episode1Detail />} />
          <Route path="/episode/2" element={<Episode2Detail />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/admin" element={<ProtectedAdmin><ApplicantList /></ProtectedAdmin>} />
          <Route path="/admin/dashboard" element={<ProtectedAdmin><Dashboard /></ProtectedAdmin>} />
          <Route path="/admin/vote" element={<ProtectedAdmin><VoteAdmin /></ProtectedAdmin>} />
          <Route path="/admin/gallery" element={<ProtectedAdmin><GalleryAdmin /></ProtectedAdmin>} />
          <Route path="/mentor-apply/:id" element={<MentorSurvey />} />
          <Route path="/admin/mentor-surveys" element={<ProtectedAdmin><MentorSurveyAdmin /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
