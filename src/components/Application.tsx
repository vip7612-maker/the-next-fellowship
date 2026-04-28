import { useState } from 'react';
import { submitApplicant } from '../utils/apiClient';
import { autoFormatPhone } from '../utils/formatPhone';
import './Application.css';

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
                </div>

                <div className="application-box">
                    <div className="application-info">

                        <h2 className="section-title" style={{ fontSize: '2.2rem' }}>속도보다는 방향,<br />우리의 기준은 <br className="mobile-only-br" /><span className="neon-text">당신의 진심</span>입니다</h2>
                        <p style={{ marginBottom: '30px' }}>학생 보드 멤버들이 당신의 고민과 신청 이유를 신중히 읽고 함께할 동료를 선발합니다.<br />지금 바로 신청하세요!</p>
                        <ul className="criteria-list" style={{ marginBottom: '40px' }}>
                            <li>신청 기간: 추후 공개 예정</li>
                            <li>선발 인원: 홍천지역 고등학생 50명</li>
                            <li>발표: 추후 개별 연락</li>
                        </ul>

                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <a href="#/episode/1" className="secondary-button" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>1회차 지난 프로그램 보기 ➔</a>
                        </div>
                        <div className="session-meta-new" style={{
                            marginBottom: '40px',
                            fontSize: '1.4rem',
                            lineHeight: '1.6',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            background: 'rgba(0, 0, 0, 0.2)',
                            padding: '20px 25px',
                            borderRadius: '12px',
                            display: 'inline-block'
                        }}>
                            <p style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.6rem' }}>📆</span>
                                <strong>일시:</strong> 추후 공개 예정
                            </p>
                            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.6rem' }}>📍</span>
                                <strong>장소:</strong> 추후 공개 예정
                            </p>
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
                            <label>윤여정 선생님께 하고 싶은 질문 *</label>
                            <textarea name="questionForYoon" placeholder="진학 리포트나 학생부 준비, 입시 전략 등 윤여정 전문가님께 묻고 싶은 질문을 자유롭게 적어주세요." value={formData.questionForYoon} onChange={handleChange} required style={{ minHeight: '80px' }}></textarea>
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
