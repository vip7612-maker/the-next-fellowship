import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { submitApplicant, uploadTranscript } from '../utils/apiClient';
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

const MAX_TRANSCRIPT_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TRANSCRIPT_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

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

    // 생기부 첨부(선택)
    const transcriptInputRef = useRef<HTMLInputElement>(null);
    const [transcript, setTranscript] = useState<{ file: File } | null>(null);
    const [transcriptError, setTranscriptError] = useState<string | null>(null);
    const [isTxDragOver, setIsTxDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [consentPrivacy, setConsentPrivacy] = useState(false);

    const acceptTranscriptFile = (file: File) => {
        setTranscriptError(null);
        if (!ALLOWED_TRANSCRIPT_TYPES.includes(file.type)) {
            setTranscriptError('PDF 또는 이미지(JPG/PNG/WebP) 파일만 첨부할 수 있습니다.');
            return;
        }
        if (file.size > MAX_TRANSCRIPT_BYTES) {
            setTranscriptError(`파일이 너무 큽니다. (${(file.size / 1024 / 1024).toFixed(1)}MB) 10MB 이하로 줄여주세요.`);
            return;
        }
        setTranscript({ file });
    };

    const handleTranscriptInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) acceptTranscriptFile(file);
    };

    const handleTranscriptDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (!isTxDragOver) setIsTxDragOver(true);
    };
    const handleTranscriptDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsTxDragOver(false);
    };
    const handleTranscriptDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsTxDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) acceptTranscriptFile(file);
    };
    const clearTranscript = () => {
        setTranscript(null);
        setTranscriptError(null);
        if (transcriptInputRef.current) transcriptInputRef.current.value = '';
    };

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
        if (!consentPrivacy) {
            alert("개인정보 수집·이용 동의(필수)에 체크해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const roleValue = formData.role === '기타' ? (formData.roleCustom || '기타') : formData.role;
            const { roleCustom: _omit, ...rest } = formData;
            void _omit;

            let uploaded: { url: string } | null = null;
            if (transcript) {
                setUploadProgress(0);
                uploaded = await uploadTranscript(transcript.file, (pct) => setUploadProgress(pct));
            }

            await submitApplicant({
                ...rest,
                role: roleValue,
                round: 2,
                ...(transcript && uploaded ? {
                    transcriptFileName: transcript.file.name,
                    transcriptMimeType: transcript.file.type,
                    transcriptUrl: uploaded.url,
                    transcriptSizeBytes: transcript.file.size
                } : {})
            });
            alert(transcript
                ? "신청이 완료되었습니다. 생기부도 함께 접수되었어요. 미니컨설팅 선정 결과는 개별 안내드립니다."
                : "신청이 완료되었습니다. 정성스러운 이야기 감사합니다!");
            setFormData({ name: '', school: '', phone: '', email: '', role: '학생', roleCustom: '', careerReason: '', motivation: '', questionForYoon: '' });
            setConsentPrivacy(false);
            clearTranscript();
        } catch (error) {
            alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(null);
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
                        <ul className="criteria-list" style={{ marginBottom: '24px' }}>
                            <li>신청 기간: 2026년 5월 15일(금)까지</li>
                            <li>선발 인원: 홍천지역 고등학생 50명</li>
                            <li>발표: 신청 마감 후 개별 연락</li>
                        </ul>

                        <div style={{
                            padding: '18px 20px',
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.10), rgba(255, 0, 127, 0.06))',
                            border: '1px solid rgba(204, 255, 0, 0.3)',
                            fontSize: '0.95rem',
                            lineHeight: 1.7,
                            color: 'var(--color-text-main)',
                            wordBreak: 'keep-all'
                        }}>
                            <div style={{ marginBottom: 6 }}>
                                <strong style={{ color: 'var(--color-neon-lime)', fontSize: '1rem' }}>🎁 큰 혜택!</strong>
                            </div>
                            <p style={{ margin: '0 0 8px', color: 'var(--color-text-main)' }}>
                                생기부를 신청서와 함께 첨부하시면, <strong style={{ color: 'var(--color-white)' }}>윤앤고 이상연 소장님</strong>이 신청자 중 몇 분을 사례로 선정하여 <strong style={{ color: 'var(--color-white)' }}>현장에서 직접 미니 컨설팅</strong>을 진행해 드립니다.
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>
                                필수는 아니지만, 첨부하실 경우 컨설팅 사례 선정에 큰 가산점이 됩니다.
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
                            <label>윤앤고 이상연 소장님께 하고 싶은 질문 *</label>
                            <textarea name="questionForYoon" placeholder="학생부 준비, 입시 전략, 합격 전략 등 윤앤고 이상연 소장님께 묻고 싶은 질문을 자유롭게 적어주세요." value={formData.questionForYoon} onChange={handleChange} required style={{ minHeight: '80px' }}></textarea>
                        </div>

                        {/* 생기부 첨부 (선택) */}
                        <div className="form-field">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                                <span style={{ whiteSpace: 'nowrap' }}>생기부 첨부</span>
                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-text-sub)', fontWeight: 500, flexShrink: 0 }}>선택</span>
                            </label>

                            <input
                                ref={transcriptInputRef}
                                type="file"
                                accept=".pdf,image/*"
                                onChange={handleTranscriptInputChange}
                                style={{ display: 'none' }}
                            />

                            {transcript ? (
                                <div
                                    onDragOver={handleTranscriptDragOver}
                                    onDragLeave={handleTranscriptDragLeave}
                                    onDrop={handleTranscriptDrop}
                                    style={{
                                        display: 'flex',
                                        gap: 14,
                                        alignItems: 'center',
                                        padding: 14,
                                        border: `1px solid ${isTxDragOver ? 'var(--color-neon-lime)' : 'rgba(204,255,0,0.4)'}`,
                                        borderRadius: 10,
                                        background: 'rgba(204, 255, 0, 0.06)'
                                    }}
                                >
                                    <div style={{ fontSize: 28 }}>{transcript.file.type.startsWith('image/') ? '🖼️' : '📄'}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: 'var(--color-white)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {transcript.file.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', marginTop: 2 }}>
                                            {(transcript.file.size / 1024).toFixed(0)}KB · {transcript.file.type}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            type="button"
                                            onClick={() => transcriptInputRef.current?.click()}
                                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, padding: '6px 12px', color: 'var(--color-text-main)', fontSize: 12, cursor: 'pointer' }}
                                        >
                                            변경
                                        </button>
                                        <button
                                            type="button"
                                            onClick={clearTranscript}
                                            style={{ background: 'rgba(255, 0, 127, 0.12)', border: '1px solid rgba(255, 0, 127, 0.4)', borderRadius: 6, padding: '6px 12px', color: '#ff7eb9', fontSize: 12, cursor: 'pointer' }}
                                        >
                                            제거
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => transcriptInputRef.current?.click()}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); transcriptInputRef.current?.click(); } }}
                                    onDragOver={handleTranscriptDragOver}
                                    onDragLeave={handleTranscriptDragLeave}
                                    onDrop={handleTranscriptDrop}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '24px 18px',
                                        borderRadius: 10,
                                        border: `2px dashed ${isTxDragOver ? 'var(--color-neon-lime)' : 'rgba(255,255,255,0.18)'}`,
                                        background: isTxDragOver ? 'rgba(204, 255, 0, 0.08)' : 'rgba(255,255,255,0.02)',
                                        textAlign: 'center',
                                        transition: 'all 0.15s ease',
                                        outline: 'none'
                                    }}
                                >
                                    <div style={{ fontSize: 28, marginBottom: 6, opacity: isTxDragOver ? 1 : 0.7 }}>
                                        {isTxDragOver ? '⤵️' : '📎'}
                                    </div>
                                    <div style={{ color: isTxDragOver ? 'var(--color-neon-lime)' : 'var(--color-white)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>
                                        {isTxDragOver ? '여기에 놓아주세요' : '생기부 파일을 끌어다 놓거나 클릭해서 선택'}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)' }}>
                                        PDF · JPG · PNG · WebP · 최대 10MB
                                    </div>
                                </div>
                            )}

                            {transcriptError && (
                                <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#ff7eb9' }}>
                                    {transcriptError}
                                </div>
                            )}
                        </div>

                        {/* 개인정보 수집·이용 동의 (필수) */}
                        <div className="form-field">
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 10,
                                padding: '14px 16px',
                                marginBottom: 12,
                                fontSize: '0.82rem',
                                lineHeight: 1.65,
                                color: 'var(--color-text-sub)',
                                maxHeight: 160,
                                overflowY: 'auto'
                            }}>
                                <div style={{ color: 'var(--color-white)', fontWeight: 600, marginBottom: 6 }}>
                                    개인정보 수집·이용 동의 안내
                                </div>
                                <div>
                                    사단법인 인순이와 좋은 사람들은 「개인정보 보호법」에 따라 다음과 같이 개인정보를 수집·이용합니다.
                                </div>
                                <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                                    <li><strong style={{ color: 'var(--color-text-main)' }}>수집 항목:</strong> 이름, 학교, 연락처(휴대폰), 이메일, 신청 내용, 첨부 자료(생기부)</li>
                                    <li><strong style={{ color: 'var(--color-text-main)' }}>수집 목적:</strong> 신청자 선발 심사, 행사 운영 안내, 미니 컨설팅 사례 선정</li>
                                    <li><strong style={{ color: 'var(--color-text-main)' }}>보유·이용 기간:</strong> 행사 종료 후 1년간 보관 후 파기</li>
                                    <li><strong style={{ color: 'var(--color-text-main)' }}>거부 권리:</strong> 동의를 거부하실 수 있으나, 거부 시 신청 접수가 어렵습니다.</li>
                                </ul>
                            </div>

                            <label style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                gap: 10,
                                padding: '12px 14px',
                                border: `1px solid ${consentPrivacy ? 'rgba(204, 255, 0, 0.5)' : 'rgba(255,255,255,0.18)'}`,
                                background: consentPrivacy ? 'rgba(204, 255, 0, 0.06)' : 'rgba(255,255,255,0.02)',
                                borderRadius: 8,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                fontSize: '0.92rem',
                                color: 'var(--color-text-main)',
                                fontWeight: 400,
                                marginBottom: 0
                            }}>
                                <input
                                    type="checkbox"
                                    checked={consentPrivacy}
                                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        flexShrink: 0,
                                        marginTop: 2,
                                        padding: 0,
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: 0,
                                        accentColor: 'var(--color-neon-lime)',
                                        cursor: 'pointer'
                                    }}
                                />
                                <span style={{ flex: 1, textAlign: 'left' }}>
                                    <strong style={{ color: 'var(--color-white)' }}>(필수)</strong> 개인정보 수집·이용에 동의합니다.
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="cta-button-main full-width" disabled={isSubmitting}>
                            {isSubmitting
                                ? (transcript
                                    ? (uploadProgress !== null && uploadProgress < 100
                                        ? `생기부 업로드 중… ${Math.round(uploadProgress)}%`
                                        : '전송 중… (생기부 업로드)')
                                    : '전송 중…')
                                : (transcript ? '지금 참가신청하기 (생기부 포함)' : '지금 참가신청하기')}
                        </button>
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
