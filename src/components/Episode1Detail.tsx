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
                            <div className="ds-image bg-blue">
                                <div className="placeholder-text">반도체 전문가<br />이미지 준비중</div>
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
                            <div className="ds-image bg-neon">
                                <div className="placeholder-text text-dark">마케팅 전문가<br />이미지 준비중</div>
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
                    </div>

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
