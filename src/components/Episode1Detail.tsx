import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Episode1Detail.css';

const Episode1Detail = () => {
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
                        <div className="intro-badge neon-text" style={{ marginBottom: '20px' }}>제1회 KickOff</div>
                        <h1 className="detail-title">Semiconductor <span className="x-mark">X</span> Marketing</h1>
                        <p className="detail-subtitle">미래 산업의 핵심 기술과, 시장을 움직이는 전략을 함께 탐구합니다.</p>

                        <div className="meta-box">
                            <p style={{ margin: 0 }}><strong>📆 일시:</strong> 4월 5일 (일) 14:00-18:00</p>
                            <p style={{ margin: 0 }}><strong>📍 장소:</strong> 홍천 신장대리 꽃신</p>
                        </div>
                    </div>

                    <div className="speakers-section">
                        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>
                            이번 회차를 이끌어갈 <span className="neon-text">전문가</span>
                        </h2>

                        <div className="detail-speaker-card">
                            <div className="ds-image bg-blue" style={{ backgroundImage: 'url(/kwon_icon.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }}>
                            </div>
                            <div className="ds-info">
                                <span className="field-tag">Semiconductor</span>
                                <h3>권정현 개발자</h3>
                                <h4>AI 시대의 핵심, Custom HBM 디지털 설계</h4>
                                <p className="ds-bio" style={{ lineHeight: '1.6' }}>
                                    현) SK하이닉스 Custom HBM 개발자, 사내 강사 (CL4)<br />
                                    전) (주)LX세미콘(구 LG전자) 선임연구원<br /><br />
                                    <strong>"대한민국 3대 기업이 동시에 선택한, 반도체 설계 엔지니어"</strong><br />
                                    삼성전자, SK하이닉스, 현대자동차 3사 모두 최종 합격이라는 타이틀을 뒤로하고, 반도체의 미래를 설계하기 위해 SK하이닉스를 선택했습니다. 기술 전문성뿐 아니라 팀 내 교육을 도맡아 성장을 돕는 엔지니어의 생생한 이야기를 전합니다.
                                </p>
                            </div>
                        </div>

                        <div className="detail-speaker-card reverse">
                            <div className="ds-image bg-neon" style={{ backgroundImage: 'url(/lee_icon.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }}>
                            </div>
                            <div className="ds-info">
                                <span className="field-tag">Marketing</span>
                                <h3>이하희 실장</h3>
                                <h4>IP 가치를 극대화하는 글로벌 전략 마케팅</h4>
                                <p className="ds-bio" style={{ lineHeight: '1.6' }}>
                                    현) 하이업엔터테인먼트 글로벌 비즈니스 실장<br />
                                    전) 아이에스티엔터테인먼트 마케팅실 실장, 플레디스엔터테인먼트 콘텐츠마케팅 과장<br /><br />
                                    <strong>"12년 차 글로벌 엔터 비즈니스 및 통합 마케팅 전문가"</strong><br />
                                    STAYC 월드투어 총괄 및 글로벌 앨범 유통 전략 수립 등 신인 데뷔부터 10주년 아티스트까지 전 과정을 아우르며, SNS와 디지털 환경에 최적화된 마케팅 전략을 통해 아티스트 브랜드 영향력을 확장하는 실전 노하우를 나눕니다.
                                </p>
                            </div>
                        </div>

                        <div className="detail-speaker-card" style={{ marginTop: '50px' }}>
                            <div className="ds-image bg-pink" style={{ backgroundImage: 'url(/yoon.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#e2e8f0' }}></div>
                            <div className="ds-info">
                                <span className="field-tag" style={{ color: '#ff007f' }}>Consulting Group</span>
                                <h3>윤여정 대표</h3>
                                <h4>데이터 기반 진학 나침반, 밀착 입시 컨설팅</h4>
                                <p className="ds-bio" style={{ lineHeight: '1.6' }}>
                                    현) 윤앤고 입시전략팀 대표 컨설턴트<br /><br />
                                    <strong>"개인별 맞춤형 생기부 분석 및 최적의 입학 전략 수립"</strong><br />
                                    변화하는 대입 전형 속에서 학생 개인의 강점을 가장 잘 살릴 수 있는 전략을 제시합니다. 막연한 진학 고민을 데이터 기반의 명확한 로드맵으로 바꾸어 주는 실질적인 컨설팅을 제공합니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="consulting-section" style={{ marginTop: '80px', marginBottom: '80px', background: 'var(--color-navy-light)', padding: '60px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-sub)', marginBottom: '5px' }}>윤앤고가 제안하는</h3>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}><span style={{ color: '#00f0ff' }}>데이터 기반</span> 진학 나침반</h2>
                            <p style={{ color: 'var(--color-text-sub)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                단순한 상담이 아닙니다. 개인별 생기부 분석부터 꿈을 구체화하는 전략까지, 믿을 수 있는 전문가 그룹이 소수 정예 밀착 컨설팅을 제공합니다.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {[
                                { num: '01', title: '입시 트렌드 이해', desc: '입시트렌드와 입시전략의 기본 이해' },
                                { num: '02', title: '생기부 기획 가이드', desc: '생기부 기획 방향 및 활동 설계 가이드' },
                                { num: '03', title: '진로 연계 정보 분석', desc: '관심(반도체/마케팅) 진로와 관련된 정보 분석' },
                                { num: '04', title: '생기부 연계 방안 적용', desc: '관심(반도체/마케팅) 진로와의 생기부 연계 방안' },
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'var(--color-navy)', padding: '30px', borderRadius: '12px', borderBottom: '3px solid #00f0ff', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '3rem', fontWeight: '900', color: 'rgba(0, 240, 255, 0.2)', marginBottom: '20px' }}>{item.num}</div>
                                    <h4 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--color-text-sub)', fontSize: '0.95rem', lineHeight: '1.5' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 
                    <div className="gallery-section" style={{ marginTop: '80px', marginBottom: '80px', display: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                                기록, 그리고 <span style={{ color: '#00f0ff' }}>성장</span>
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px' }}>
                            <div style={{ background: 'var(--color-navy-light)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', gridRow: 'span 2' }}>
                                <span style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem' }}>1회차 메인 강연 하이라이트 영상</span>
                            </div>

                            <div style={{ background: 'var(--color-navy-light)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem' }}>멘토링 세션 현장 스케치 01</span>
                            </div>

                            <div style={{ background: 'var(--color-navy-light)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem' }}>참가 학생 인터뷰</span>
                            </div>

                            <div style={{ background: 'var(--color-navy-light)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: '1 / 2' }}>
                                <span style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem' }}>입시 컨설팅 현장</span>
                            </div>
                        </div>
                    </div> 
                    */}

                    <div className="bottom-cta">
                        <h2 className="section-title">여러분의 진심을 기다립니다.</h2>
                        <Link to="/#application" className="cta-button-main" style={{ display: 'inline-block', textDecoration: 'none', padding: '15px 40px', fontSize: '1.2rem' }}>신청하러 가기</Link>
                    </div>
                </div>
            </main>

            <div className="floating-btn-container">
                <Link to="/#application" className="cta-button-main" style={{ textDecoration: 'none' }}>신청하러 가기</Link>
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

export default Episode1Detail;
