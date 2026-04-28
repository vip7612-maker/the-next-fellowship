import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Admin.css';

const AdminLayout = ({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) => {
    const location = useLocation();

    return (
        <div className="admin-body">
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <h2>ADMIN PANEL</h2>
                    <nav className="admin-menu">
                        <Link to="/admin" className={`menu-item ${location.pathname === '/admin' ? 'active' : ''}`}>
                            신청자 목록
                        </Link>
                        <Link to="/admin/dashboard" className={`menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                            📊 대시보드
                        </Link>
                        <Link to="/admin/vote" className={`menu-item ${location.pathname === '/admin/vote' ? 'active' : ''}`}>
                            주제신청 현황
                        </Link>
                        <Link to="/admin/gallery" className={`menu-item ${location.pathname === '/admin/gallery' ? 'active' : ''}`}>
                            갤러리 관리
                        </Link>
                        <Link to="/admin/survey" className={`menu-item ${location.pathname === '/admin/survey' ? 'active' : ''}`}>
                            📝 설문 및 QR 관리
                        </Link>
                        <Link to="/admin/mentor-surveys" className={`menu-item ${location.pathname === '/admin/mentor-surveys' ? 'active' : ''}`}>
                            🎓 멘토 신청 (회차별)
                        </Link>
                        <Link to="/" className="menu-item" style={{ marginTop: 'auto', opacity: 0.5 }}>
                            홈으로 가기
                        </Link>
                        {onLogout && (
                            <button onClick={onLogout} className="menu-item" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, textAlign: 'left', padding: '10px 15px' }}>
                                로그아웃
                            </button>
                        )}
                    </nav>
                </aside>

                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
