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

    const metaInline = [survey.eventDate, survey.location, survey.capacity]
        .filter((v) => v && v.trim())
        .join(' · ');

    return (
        <section className="mb-section" aria-labelledby="mb-title">
            <div className="container">
                <div className="mb-poster">
                    <div className="mb-decor mb-decor-blob" aria-hidden="true" />
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

                    <div className="mb-stamp" aria-hidden="true">
                        <span className="mb-stamp-num">{survey.round.toString().padStart(2, '0')}</span>
                        <span className="mb-stamp-label">회차</span>
                    </div>

                    <div className="mb-content">
                        <div className="mb-eyebrow">
                            The Next Fellowship · 대학생 멘토 모집
                        </div>
                        <h2 id="mb-title" className="mb-title">
                            지방의 청소년에게, 당신의 <span className="mb-title-accent">전공 이야기</span>를 들려주세요.
                        </h2>
                        {metaInline && <p className="mb-meta-inline">{metaInline}</p>}
                    </div>

                    <a href={applyUrl} className="mb-cta">
                        멘토 신청하기
                        <span className="mb-cta-arrow" aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default MentorBanner;
