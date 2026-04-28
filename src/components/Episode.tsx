import { Link } from 'react-router-dom';
import { useGallerySlot } from '../utils/useGallerySlot';
import GalleryImage from './GalleryImage';
import './Episode.css';

const EPISODE1_PHOTOS = [
    { slot: 'episode1_photo_1', fallback: '/episode1/1.jpg', alt: '1회차 KickOff – 윤여정 대표 컨설팅 강연' },
    { slot: 'episode1_photo_2', fallback: '/episode1/2.jpg', alt: '1회차 KickOff – 학생 보드 멤버 진행' },
    { slot: 'episode1_photo_3', fallback: '/episode1/3.jpg', alt: '1회차 KickOff – 권정현 개발자 강연' },
    { slot: 'episode1_photo_4', fallback: '/episode1/4.jpg', alt: '1회차 KickOff – 컨설팅 세션 현장' },
];

const Episode1PhotoLink = ({ photo, index }: { photo: typeof EPISODE1_PHOTOS[number]; index: number }) => {
    const dynamic = useGallerySlot(photo.slot);
    const src = dynamic?.dataUrl || photo.fallback;
    return (
        <Link
            to="/episode/1"
            className={`episode-photo episode-photo-${index + 1}`}
            aria-label={photo.alt}
            style={{ backgroundImage: `url(${src})` }}
        >
            <div className="episode-photo-overlay">
                <span className="episode-photo-caption">{photo.alt}</span>
            </div>
        </Link>
    );
};

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
                        <Episode1PhotoLink key={i} photo={photo} index={i} />
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

                        <div className="person-item" style={{ borderBottom: 'none' }}>
                            <div className="person-role">Consulting Group</div>
                            <div className="person-name">이상연 소장</div>
                            <div className="person-desc" style={{ marginBottom: 8 }}>합격을 만드는 입시 플래너</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.6, textAlign: 'left' }}>
                                <strong style={{ color: 'var(--color-white)' }}>현)</strong> 윤앤고 입시컨설팅 소장<br />
                                <strong style={{ color: 'var(--color-text-sub)' }}>전)</strong> 메가스터디 러셀 입시연구소장<br />
                                <strong style={{ color: 'var(--color-text-sub)' }}>전)</strong> 메가스터디 러셀 입시교육총괄<br />
                                <strong style={{ color: 'var(--color-text-sub)' }}>전)</strong> 메가스터디 최상위권반 전문담임
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <GalleryImage
                                slot="episode_card_consulting"
                                fallback="/episode1/4.jpg"
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
                            <GalleryImage
                                slot="episode_card_mentor"
                                fallback="/episode1/2.jpg"
                                alt="1회차 학생 보드 멤버가 멘토링 세션을 진행하는 모습"
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

                    {/* Card 3: Expert (이번 회차 강사 1인) */}
                    <div className="episode-card theme-neon" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-icon">전문가</div>
                        <h3 className="card-title">이번 회차를 이끌어갈 강사</h3>

                        <div className="person-item" style={{ borderBottom: 'none' }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                                <GalleryImage
                                    slot="expert_kim_daesik"
                                    fallback="/kim_daesik.jpg"
                                    alt="김대식 교수"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        objectPosition: 'center top',
                                        background: '#e2e8f0',
                                        border: '2px solid rgba(204, 255, 0, 0.4)'
                                    }}
                                />
                            </div>
                            <div className="person-role">AI · Brain Science</div>
                            <div className="person-name">김대식 교수</div>
                            <div className="person-desc">뇌과학으로 풀어낸 AI 시대, 인간의 다음 진로</div>
                            <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--color-neon-lime)', lineHeight: '1.6', textAlign: 'left' }}>
                                <strong style={{ color: 'var(--color-white)', fontSize: '0.9rem' }}>"AI와 뇌과학을 잇는 한국의 대표 융합 연구자"</strong>
                                <div style={{ marginTop: '10px', color: 'var(--color-white)', fontSize: '0.83rem', fontWeight: 600 }}>현직</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 10px', color: 'var(--color-text-sub)' }}>
                                    <li>· KAIST 전자및전기공학과 교수</li>
                                    <li>· 건명원 과학분야 운영위원</li>
                                </ul>
                                <div style={{ color: 'var(--color-white)', fontSize: '0.83rem', fontWeight: 600 }}>주요 경력</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 10px', color: 'var(--color-text-sub)' }}>
                                    <li>· MIT 박사후연구원</li>
                                    <li>· 미네소타대 의대 자기공명연구센터 조교수</li>
                                    <li>· 보스턴대 생체의학이미지센터 부교수</li>
                                    <li>· KAIST 전자및전기공학과 부학과장</li>
                                </ul>
                                <div style={{ color: 'var(--color-white)', fontSize: '0.83rem', fontWeight: 600 }}>학력</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', color: 'var(--color-text-sub)' }}>
                                    <li>· 막스 플랑크 뇌 연구소 (뇌과학 박사)</li>
                                    <li>· 다름슈타트 공과대 (컴퓨터공학·심리학)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Episode;
