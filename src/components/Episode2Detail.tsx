import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import GalleryImage from './GalleryImage';
import './Episode1Detail.css';

const Episode2Detail = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="episode-detail-page">
            <Navbar />
            <main className="detail-main">
                <div className="container">
                    <Link to="/" className="back-link">← 메인으로 돌아가기</Link>

                    <div className="detail-header">
                        <div
                            className="intro-badge neon-text"
                            style={{
                                marginBottom: '20px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '6px 18px',
                                border: '1px solid rgba(204, 255, 0, 0.4)',
                                borderRadius: 999
                            }}
                        >
                            <span style={{ fontSize: '0.75rem', letterSpacing: '0.18em', opacity: 0.85 }}>2nd</span>
                            <span style={{ width: 1, height: 14, background: 'rgba(204,255,0,0.4)' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em' }}>2회차 · AI 융합</span>
                        </div>

                        <h1 className="detail-title" style={{ wordBreak: 'keep-all' }}>
                            내가 좋아하는 그것에,<br />
                            <span className="neon-text">AI를 더하는 순간.</span>
                        </h1>

                        <p className="detail-subtitle" style={{ wordBreak: 'keep-all', maxWidth: 760, margin: '0 auto 32px' }}>
                            그 교차점에서, 한 번도 없던 직업이 태어납니다.<br />
                            2회차 주제와 세부 일정은 곧 공개됩니다 — 지금 미리 신청해 두세요.
                        </p>

                        <div className="meta-box" style={{ background: 'rgba(204, 255, 0, 0.05)', borderColor: 'rgba(204, 255, 0, 0.25)' }}>
                            <p style={{ margin: 0 }}><strong>📆 일시:</strong> 2026년 5월 17일(일) 14:00–17:00</p>
                            <p style={{ margin: 0 }}><strong>📍 장소:</strong> 홍천읍 꽃신</p>
                            <p style={{ margin: 0 }}><strong>📝 신청 기간:</strong> 5월 15일(금)까지</p>
                            <p style={{ margin: 0 }}><strong>👥 모집:</strong> 홍천지역 고등학생 50명</p>
                        </div>
                    </div>

                    {/* 이번 회차 강사 */}
                    <div className="speakers-section">
                        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>
                            이번 회차를 이끌어갈 <span className="neon-text">강사</span>
                        </h2>

                        <div className="detail-speaker-card">
                            <GalleryImage
                                slot="expert_lee_kyungjin"
                                fallback="/staff/3.jpg"
                                asBackground
                                alt="이경진 사무국장"
                                placeholderLabel="이경진 사무국장"
                                className="ds-image bg-neon"
                            />
                            <div className="ds-info">
                                <span className="field-tag" style={{ color: 'var(--color-neon-lime)' }}>사단법인 인순이와 좋은 사람들 사무국장</span>
                                <h3>이경진</h3>
                                <h4>해밀학교 설립 운영 총괄 · 인공지능 활용 다문화교육 성공사례</h4>
                                <p className="ds-bio">
                                    <strong>現)</strong> 사단법인 인순이와 좋은 사람들 사무국장<br />
                                    <strong>前)</strong> 해밀학교 교장<br /><br />
                                    <strong>· 해밀학교 설립 운영 총괄</strong><br />
                                    <strong>· 인공지능 활용 다문화교육 성공사례</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 이번 회차 컨설턴트 */}
                    <div className="speakers-section" style={{ marginTop: 80 }}>
                        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>
                            이번 회차 <span style={{ color: '#ff007f' }}>입시 컨설팅</span>
                        </h2>

                        <div className="detail-speaker-card reverse">
                            <GalleryImage
                                slot="consultant_lee_sangyeon"
                                fallback="/lee_sangyeon.jpg"
                                asBackground
                                alt="이상연 소장"
                                placeholderLabel="이상연 소장"
                                className="ds-image"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.18), rgba(255, 0, 127, 0.04))',
                                    border: '1px solid rgba(255, 0, 127, 0.3)'
                                }}
                            />
                            <div className="ds-info">
                                <span className="field-tag" style={{ color: '#ff7eb9' }}>Consulting Group</span>
                                <h3>이상연 소장</h3>
                                <h4>합격을 만드는 입시 플래너</h4>
                                <p className="ds-bio">
                                    <strong>현)</strong> 윤앤고 입시컨설팅 소장<br />
                                    <strong>전)</strong> 메가스터디 러셀 입시연구소장<br />
                                    <strong>전)</strong> 메가스터디 러셀 입시교육총괄<br />
                                    <strong>전)</strong> 메가스터디 최상위권반 전문담임
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <div className="floating-btn-container">
                <Link to="/#application" className="cta-button-main" style={{ textDecoration: 'none' }}>
                    참가신청하기
                </Link>
            </div>

            <footer>
                <div className="container footer-content">
                    <div className="footer-logo">
                        THE <span className="neon-text">NEXT</span> FELLOWSHIP
                    </div>
                    <div className="footer-right">
                        <p>© 2026 인순이와 좋은 사람들. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Episode2Detail;
