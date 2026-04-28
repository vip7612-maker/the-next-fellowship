import { useState } from 'react';
import { submitApplicant } from '../utils/apiClient';
import { autoFormatPhone } from '../utils/formatPhone';
import './Application.css';

// 2회차 일정 정보
const EVENT_DATE = new Date('2026-05-17T14:00:00+09:00');
const EVENT_END = '17:00';
const EVENT_LOCATION = '홍천읍 꽃신';
const EVENT_LOCATION_DETAIL = '강원특별자치도 홍천군 홍천읍 홍천로5길 10';

const computeDday = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const event = new Date(EVENT_DATE.getFullYear(), EVENT_DATE.getMonth(), EVENT_DATE.getDate()).getTime();
    const diffDays = Math.round((event - today) / (1000 * 60 * 60 * 24));
    return diffDays;
};

const EventScheduleHero = () => {
    const dday = computeDday();
    const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-DAY' : `D+${Math.abs(dday)}`;
    const ddayActive = dday >= 0;

    return (
        <div className="event-schedule-hero" style={{
            marginTop: '36px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '24px',
            alignItems: 'stretch',
            background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.08), rgba(0, 240, 255, 0.05))',
            border: '1px solid rgba(204, 255, 0, 0.25)',
            borderRadius: '20px',
            padding: '28px 32px',
            maxWidth: '760px',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: '0 12px 40px -12px rgba(0,0,0,0.4)'
        }}>
            {/* D-Day 배지 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 22px',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                paddingRight: '28px'
            }}>
                <div style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    color: ddayActive ? 'var(--color-neon-lime)' : 'var(--color-text-sub)',
                    fontWeight: 700,
                    marginBottom: '4px'
                }}>
                    EVENT
                </div>
                <div style={{
                    fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
                    fontWeight: 900,
                    color: ddayActive ? 'var(--color-neon-lime)' : 'var(--color-text-sub)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em'
                }}>
                    {ddayLabel}
                </div>
            </div>

            {/* 날짜/시간/장소 */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                justifyContent: 'center',
                textAlign: 'left'
            }}>
                <div>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--color-text-sub)', fontWeight: 700, marginBottom: '4px' }}>
                        📅 WHEN
                    </div>
                    <div style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', fontWeight: 800, color: 'var(--color-white)', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                        2026년 5월 17일 <span style={{ color: 'var(--color-neon-lime)' }}>(일)</span>
                    </div>
                    <div style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', color: 'var(--color-text-main)', marginTop: '2px', fontWeight: 600 }}>
                        오후 2:00 — {EVENT_END} (3시간)
                    </div>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

                <div>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--color-text-sub)', fontWeight: 700, marginBottom: '4px' }}>
                        📍 WHERE
                    </div>
                    <div style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', fontWeight: 700, color: 'var(--color-white)', lineHeight: 1.3 }}>
                        {EVENT_LOCATION}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', marginTop: '2px' }}>
                        {EVENT_LOCATION_DETAIL}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Application = () => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        school: '',
        phone: '',
        email: '',
        role: '학생',
        roleCustom: '',
        careerReason: '',
        motivation: '',
        questionForYoon: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData(prev => ({ ...prev, phone: autoFormatPhone(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.careerReason || !formData.motivation || !formData.questionForYoon) {
            alert("필수 항목(이름, 연락처, 진로이유, 지원동기, 질문)을 모두 입력해주세요.");
            return;
        }

        try {
            const roleValue = formData.role === '기타' ? (formData.roleCustom || '기타') : formData.role;
            const { roleCustom, ...rest } = formData;
            await submitApplicant({ ...rest, role: roleValue, round: 2 });
            alert("신청이 완료되었습니다. 정성스러운 이야기 감사합니다!");
            setFormData({ name: '', school: '', phone: '', email: '', role: '학생', roleCustom: '', careerReason: '', motivation: '', questionForYoon: '' });
        } catch (error: any) {
            alert(error.message || "오류가 발생했습니다.");
        }
    };

    return (
        <section className="application" id="application">
            <div className="container">
                <div className="session-header-top" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span className="session-topic-tag" style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '999px',
                        border: '1px solid rgba(204, 255, 0, 0.4)',
                        color: 'var(--color-neon-lime)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        marginBottom: '20px'
                    }}>
                        2회차 · AI 융합
                    </span>
                    <h3 className="session-title-top" style={{ fontSize: '3.5rem', lineHeight: '1.3', marginBottom: '18px', wordBreak: 'keep-all' }}>
                        내가 좋아하는 그것에,<br />
                        <span className="neon-text">AI를 더하는 순간.</span>
                    </h3>
                    <p className="session-desc-top" style={{ fontSize: '1.2rem', color: 'var(--color-text-sub)', lineHeight: '1.65', wordBreak: 'keep-all' }}>
                        그 교차점에서, 한 번도 없던 직업이 태어납니다.<br />
                        2회차 주제와 세부 일정은 곧 공개됩니다 — 지금 미리 신청해 두세요.
                    </p>

                    <EventScheduleHero />
                </div>

                <div className="application-box">
                    <div className="application-info">

                        <h2 className="section-title" style={{ fontSize: '2.2rem' }}>좋아하는 분야가 분명할수록,<br /><span className="neon-text">AI는 더 멀리</span> 데려다 줍니다</h2>
                        <p style={{ marginBottom: '30px' }}>음악·운동·글쓰기·요리·게임 — 무엇을 좋아하든 좋습니다.<br />그 관심에 AI를 더해 ‘나만의 다음 진로’를 함께 그려볼 50명을 모십니다.</p>
                        <ul className="criteria-list" style={{ marginBottom: '40px' }}>
                            <li>신청 기간: 2026년 5월 15일(금)까지</li>
                            <li>선발 인원: 홍천지역 고등학생 50명</li>
                            <li>발표: 신청 마감 후 개별 연락</li>
                        </ul>

                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <a href="#/episode/1" className="secondary-button" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>1회차 지난 프로그램 보기 ➔</a>
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
                        <div className="form-row">
                            <div className="form-field">
                                <label>신청자 유형 *</label>
                                <select name="role" value={formData.role} onChange={handleChange} required
                                    style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontSize: '1rem', appearance: 'none', cursor: 'pointer' }}>
                                    <option value="학생">학생</option>
                                    <option value="교사">교사</option>
                                    <option value="학부모">학부모</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                            {formData.role === '기타' && (
                                <div className="form-field">
                                    <label>기타 (직접 입력) *</label>
                                    <input type="text" name="roleCustom" placeholder="예: 대학생, 직장인 등" value={formData.roleCustom} onChange={handleChange} required />
                                </div>
                            )}
                        </div>
                        <div className="form-field">
                            <label>희망하는 진로와 그 진로를 희망하게 된 이유 *</label>
                            <textarea name="careerReason" placeholder="어떤 진로를 꿈꾸고 있고, 왜 그 길을 선택했는지 관련 경험을 들려주세요." value={formData.careerReason} onChange={handleChange} required style={{ minHeight: '80px' }}></textarea>
                        </div>
                        <div className="form-field">
                            <label>이 프로그램에 지원하게 된 동기 *</label>
                            <textarea name="motivation" placeholder="넥스트 펠로우십에서 어떤 경험과 배움을 얻어가고 싶으신가요?" value={formData.motivation} onChange={handleChange} required style={{ minHeight: '80px' }}></textarea>
                        </div>
                        <div className="form-field">
                            <label>윤앤고 이상연 소장님께 하고 싶은 질문 *</label>
                            <textarea name="questionForYoon" placeholder="학생부 준비, 입시 전략, 합격 전략 등 윤앤고 이상연 소장님께 묻고 싶은 질문을 자유롭게 적어주세요." value={formData.questionForYoon} onChange={handleChange} required style={{ minHeight: '80px' }}></textarea>
                        </div>
                        <button type="submit" className="cta-button-main full-width">지금 참가신청하기</button>
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
