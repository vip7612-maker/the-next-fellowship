import { useEffect, useState } from 'react';
import { fetchLatestActiveMentorSurvey, type MentorSurvey } from '../utils/apiClient';
import './MentorBanner.css';

const MentorBanner = () => {
    const [survey, setSurvey] = useState<MentorSurvey | null>(null);

    useEffect(() => {
        fetchLatestActiveMentorSurvey()
            .then((data) => setSurvey(data))
            .catch(() => setSurvey(null));
    }, []);

    if (!survey) return null;

    const applyUrl = `#/mentor-apply/${survey.id}`;

    return (
        <section className="mb-section" aria-labelledby="mb-title">
            <div className="container">
                <div className="mb-poster">
                    <div className="mb-decor mb-decor-blob-tl" aria-hidden="true" />
                    <div className="mb-decor mb-decor-blob-br" aria-hidden="true" />
                    <div className="mb-decor mb-decor-leaf" aria-hidden="true">
                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M32 4C16 12 6 24 6 38c0 12 8 22 22 22 14 0 28-10 32-30C56 18 46 8 32 4Z"
                                fill="#cdd99e"
                                opacity="0.55"
                            />
                            <path
                                d="M14 50C24 38 36 30 54 26"
                                stroke="#2b5b3a"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                opacity="0.6"
                            />
                        </svg>
                    </div>

                    <div className="mb-grid">
                        <div className="mb-content">
                            <div className="mb-eyebrow">
                                The Next Fellowship · {survey.round}회차 · 대학생 멘토 모집
                            </div>
                            <h2 id="mb-title" className="mb-title">
                                지방의 청소년에게,<br />
                                당신의 <span className="mb-title-accent">전공 이야기</span>를<br />
                                들려주세요.
                            </h2>
                            <p className="mb-lede">
                                강원도 홍천 지역 고등학생을 위한 진로·전공 멘토링.<br />
                                전공 선택의 이유, 캠퍼스 생활, 고교 시절 준비 과정을<br />
                                후배들과 솔직하게 나누어 주실 멘토님을 모십니다.
                            </p>

                            <div className="mb-meta">
                                {survey.eventDate && (
                                    <div className="mb-meta-row">
                                        <span className="mb-meta-label">일시</span>
                                        <span className="mb-meta-value">{survey.eventDate}</span>
                                    </div>
                                )}
                                {survey.location && (
                                    <div className="mb-meta-row">
                                        <span className="mb-meta-label">장소</span>
                                        <span className="mb-meta-value">{survey.location}</span>
                                    </div>
                                )}
                                {survey.capacity && (
                                    <div className="mb-meta-row">
                                        <span className="mb-meta-label">모집</span>
                                        <span className="mb-meta-value">{survey.capacity}</span>
                                    </div>
                                )}
                                <div className="mb-meta-row">
                                    <span className="mb-meta-label">지원</span>
                                    <span className="mb-meta-value">교통비 지급 · 활동 확인서 발급 · 공익 네트워크 참여</span>
                                </div>
                            </div>

                            <div className="mb-cta-row">
                                <a href={applyUrl} className="mb-cta">
                                    멘토 신청서 작성하기
                                    <span className="mb-cta-arrow" aria-hidden="true">→</span>
                                </a>
                                <p className="mb-cta-note">
                                    제출 후 영업일 기준 7일 이내 개별 안내드립니다.
                                </p>
                            </div>
                        </div>

                        <aside className="mb-side">
                            <div className="mb-stamp">
                                <div className="mb-stamp-num">{survey.round.toString().padStart(2, '0')}</div>
                                <div className="mb-stamp-label">회차</div>
                                <div className="mb-stamp-divider" />
                                <div className="mb-stamp-meta">대학생 멘토</div>
                                <div className="mb-stamp-meta-sub">College Mentor Wanted</div>
                            </div>
                            <div className="mb-org">
                                <div className="mb-org-label">주최</div>
                                <div className="mb-org-name">사단법인 인순이와 좋은 사람들</div>
                                <div className="mb-org-sub">The Next Fellowship Project</div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorBanner;
