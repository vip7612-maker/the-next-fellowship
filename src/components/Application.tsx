import { useState, useEffect } from 'react';
import { addApplicant, getApplicants, getTargetCapacity } from '../admin/mockData';
import './Application.css';

const Application = () => {
    const [applicantCount, setApplicantCount] = useState(0);
    const [targetCapacity, setTargetCapacity] = useState(50);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        school: '',
        phone: '',
        email: '',
        major: '',
        reason: ''
    });

    useEffect(() => {
        setApplicantCount(getApplicants().length);
        setTargetCapacity(getTargetCapacity());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.reason) {
            alert("이름, 연락처, 지원 이유는 필수 항목입니다.");
            return;
        }

        addApplicant(formData);

        alert("신청이 완료되었습니다. 정성스러운 이야기 감사합니다!");
        setFormData({ name: '', school: '', phone: '', email: '', major: '', reason: '' });
        setApplicantCount(getApplicants().length);
    };

    return (
        <section className="application" id="application">
            <div className="container">
                <div className="session-header-top" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h3 className="session-title-top" style={{ fontSize: '3.5rem', lineHeight: '1.3', marginBottom: '20px' }}>
                        1회차: <span className="neon-text">Semiconductor X Marketing</span>
                    </h3>
                    <p className="session-desc-top" style={{ fontSize: '1.3rem', color: 'var(--color-text-sub)' }}>미래 산업의 핵심 기술과, 시장을 움직이는 전략을 함께 탐구합니다.</p>
                </div>

                <div className="application-box">
                    <div className="application-info">
                        <div className="session-meta-new" style={{ marginBottom: '30px' }}>
                            <p style={{ margin: 0 }}><strong>📆 일시:</strong> 4월 5일 (일) 14:00-18:00</p>
                            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <strong>📍 장소:</strong> 홍천 신장대리 꽃신
                                <button className="map-btn" onClick={() => setIsMapOpen(true)}>지도보기</button>
                            </p>
                        </div>
                        <h2 className="section-title" style={{ fontSize: '2.2rem' }}>속도보다는 방향,<br />우리의 기준은 <br className="mobile-only-br" /><span className="neon-text">당신의 진심</span>입니다</h2>
                        <p style={{ marginBottom: '30px' }}>학생 보드 멤버들이 당신의 고민과 신청 이유를 신중히 읽고 함께할 동료를 선발합니다.<br />지금 바로 신청하세요!</p>
                        <ul className="criteria-list" style={{ marginBottom: '40px' }}>
                            <li>신청 기간: ~ 3월 20일 18:00까지</li>
                            <li>선발 인원: 강원도 지역 고등학생 00명</li>
                            <li>발표: 3월 21일 개별 연락</li>
                        </ul>

                        <div style={{ marginTop: '20px', marginBottom: '40px' }}>
                            <a href="#/episode/1" className="secondary-button" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>1회차 프로그램 더 알아보기 ➔</a>
                        </div>
                    </div>

                    <form className="application-form-preview" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-field">
                                <label>이름 *</label>
                                <input type="text" name="name" placeholder="홍길동" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label>학교</label>
                                <input type="text" name="school" placeholder="홍천고등학교" value={formData.school} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-field">
                                <label>연락처 *</label>
                                <input type="text" name="phone" placeholder="010-1234-5678" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-field">
                                <label>이메일</label>
                                <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-field">
                            <label>꿈꾸는 전공이나 학과가 있나요?</label>
                            <input type="text" name="major" placeholder="예: 인공지능, 영상 미디어..." value={formData.major} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                            <label>펠로우십에 합류하고 싶은 진짜 이유는? *</label>
                            <textarea name="reason" placeholder="당신만의 이야기를 들려주세요 (최소 100자)" value={formData.reason} onChange={handleChange} required></textarea>
                        </div>
                        <button type="submit" className="cta-button-main full-width">지금 참가신청하기</button>
                        <p className="waitlist-info">
                            {applicantCount > targetCapacity
                                ? `현재 ${applicantCount - targetCapacity}명의 대기자가 있습니다 (신청률 ${Math.round((applicantCount / targetCapacity) * 100)}%)`
                                : `현재 ${applicantCount}명이 신청을 완료했습니다 (목표 정원 ${targetCapacity}명)`}
                        </p>
                    </form>
                </div>
            </div>

            {isMapOpen && (
                <div className="map-modal-overlay" onClick={() => setIsMapOpen(false)}>
                    <div className="map-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="map-modal-header">
                            <h3>오시는 길</h3>
                            <button className="map-close-btn" onClick={() => setIsMapOpen(false)}>&times;</button>
                        </div>
                        <p className="map-address">강원특별자치도 홍천군 홍천읍 홍천로5길 10</p>
                        <div className="map-iframe-container">
                            <iframe
                                src="https://www.google.com/maps?q=강원특별자치도 홍천군 홍천읍 홍천로5길 10&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Application;
