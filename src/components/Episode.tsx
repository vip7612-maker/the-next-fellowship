import { Link } from 'react-router-dom';
import './Episode.css';

const EPISODE1_PHOTOS = [
    { src: '/episode1/1.jpg', alt: '1회차 KickOff – 윤여정 대표 컨설팅 강연' },
    { src: '/episode1/2.jpg', alt: '1회차 KickOff – 학생 보드 멤버 진행' },
    { src: '/episode1/3.jpg', alt: '1회차 KickOff – 권정현 개발자 강연' },
    { src: '/episode1/4.jpg', alt: '1회차 KickOff – 컨설팅 세션 현장' },
];

const Episode = () => {
    return (
        <section className="episode" id="episode">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{ display: 'inline-block', padding: '6px 20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-text-sub)', fontSize: '0.95rem', marginBottom: '16px' }}>PAST EPISODE</span>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-white)', margin: 0 }}>
                        지난 회차 보기 — <span className="neon-text">1회차</span>
                    </h2>
                    <p style={{ marginTop: '12px', color: 'var(--color-text-sub)', fontSize: '1.1rem' }}>Semiconductor X Marketing · 2026년 4월 5일</p>
                </div>

                {/* 1회차 현장 스케치 */}
                <div className="episode-photos">
                    {EPISODE1_PHOTOS.map((photo, i) => (
                        <Link
                            key={i}
                            to="/episode/1"
                            className={`episode-photo episode-photo-${i + 1}`}
                            aria-label={photo.alt}
                            style={{ backgroundImage: `url(${photo.src})` }}
                        >
                            <div className="episode-photo-overlay">
                                <span className="episode-photo-caption">{photo.alt}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <p style={{ textAlign: 'center', color: 'var(--color-text-sub)', fontSize: '0.95rem', marginTop: '14px', marginBottom: '48px' }}>
                    1회차 현장 스케치 — 사진을 클릭하면 1회차 상세 페이지로 이동합니다.
                </p>

                <div className="episode-grid">
                    {/* Card 1: Consulting */}
                    <div className="episode-card theme-pink" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-icon">컨설팅</div>
                        <h3 className="card-title">데이터 기반 진학 나침반</h3>

                        <div className="person-item">
                            <div className="person-role">Consulting Group</div>
                            <div className="person-name">윤여정 대표</div>
                            <div className="person-desc">윤앤고 입시전략팀<br />입시트랜드와 진학관련 이슈를 단번에 정리하는 임팩트 특강<br />현장에서 직접 질문하며 생기부 및 진학궁금증을 해결할 수 있는 미니컨설팅</div>
                        </div>


                        <div style={{ marginTop: 'auto', paddingTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <img
                                src="/episode1/4.jpg"
                                alt="1회차 윤여정 대표 입시 컨설팅 강연 현장"
                                style={{
                                    width: '100%',
                                    maxHeight: '220px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    objectPosition: 'center'
                                }}
                            />
                        </div>
                    </div>

                    {/* Card 2: Mentors */}
                    <div className="episode-card theme-blue" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-icon">멘토</div>
                        <h3 className="card-title">함께 고민을 나눌 대학생 멘토</h3>

                        <div className="person-item" style={{ borderBottom: 'none', paddingTop: '20px' }}>
                            <div className="person-name" style={{ color: 'var(--color-text-sub)', fontSize: '1.1rem', fontWeight: 500, lineHeight: '1.6' }}>
                                참가자들의 꿈과 목표에 가장 잘 맞는<br />
                                <strong style={{ color: 'var(--color-white)' }}>최적의 멘토를 매칭중입니다.</strong>
                            </div>
                        </div>


                        <div style={{ marginTop: 'auto', paddingTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <img src="/mentor_illustration.png" alt="Mentor Logo" style={{ width: '100%', maxHeight: '200px', borderRadius: '12px', opacity: 0.9, objectFit: 'cover' }} />
                        </div>
                    </div>

                    {/* Card 3: Experts */}
                    <div className="episode-card theme-neon" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-icon">전문가</div>
                        <h3 className="card-title">이번 회차를 이끌어갈 강사진</h3>

                        <div className="person-item">
                            <div className="person-role">Semiconductor</div>
                            <div className="person-name">권정현 개발자</div>
                            <div className="person-desc">AI 시대의 핵심, Custom HBM 디지털 설계</div>
                            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-neon-lime)', lineHeight: '1.5' }}>
                                현) SK하이닉스 Custom HBM 개발자, 사내 강사 (CL4)<br />
                                <strong style={{ color: 'var(--color-white)', fontSize: '0.9rem' }}>"대한민국 3대 기업이 동시에 선택한, 반도체 설계 엔지니어"</strong><br />
                                <span style={{ color: 'var(--color-text-sub)' }}>삼성전자, SK하이닉스, 현대자동차 3사 모두 최종 합격</span>
                            </div>
                        </div>

                        <div className="person-item" style={{ borderBottom: 'none' }}>
                            <div className="person-role">Marketing</div>
                            <div className="person-name">이하희 실장</div>
                            <div className="person-desc">IP 가치를 극대화하는 글로벌 전략 마케팅</div>
                            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-white)', lineHeight: '1.5' }}>
                                <strong style={{ color: 'var(--color-neon-lime)', fontSize: '0.9rem' }}>현) 하이업엔터테인먼트 글로벌 비즈니스 실장</strong><br />
                                <span style={{ color: 'var(--color-text-sub)' }}>STAYC 월드투어 총괄 및 글로벌 앨범 유통 전략 수립</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Episode;
