import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
    fetchMentorSurvey,
    submitMentorResponse,
    type MentorSurvey as MentorSurveyType
} from '../utils/apiClient';
import './MentorSurvey.css';

const initialForm = {
    name: '',
    phone: '',
    email: '',
    university: '',
    grade: '',
    major: '',
    attendance: '',
    transport: '',
    motivation: '',
    shareStory: '',
    experience: '',
    consentPersonal: false,
    consentImage: false
};

const MentorSurvey = () => {
    const { id } = useParams<{ id: string }>();
    const [survey, setSurvey] = useState<MentorSurveyType | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoadError('잘못된 접근입니다.');
            setLoading(false);
            return;
        }
        fetchMentorSurvey(id)
            .then((data) => setSurvey(data))
            .catch((err) => setLoadError(err.message || '설문 정보를 불러올 수 없습니다.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setSubmitError(null);

        if (!form.consentPersonal) {
            setSubmitError('개인정보 수집·이용 동의(필수)에 체크해주세요.');
            return;
        }

        setSubmitting(true);
        try {
            await submitMentorResponse({
                surveyId: id,
                name: form.name.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                university: form.university.trim(),
                grade: form.grade,
                major: form.major.trim(),
                attendance: form.attendance,
                transport: form.transport,
                motivation: form.motivation.trim(),
                shareStory: form.shareStory.trim(),
                experience: form.experience.trim(),
                consentPersonal: form.consentPersonal ? 1 : 0,
                consentImage: form.consentImage ? 1 : 0
            });
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            const msg = err instanceof Error ? err.message : '신청 제출 중 오류가 발생했습니다.';
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="ms-wrap">
                <div className="ms-hero">
                    <p style={{ textAlign: 'center', color: '#767676' }}>설문 정보를 불러오는 중입니다…</p>
                </div>
            </div>
        );
    }

    if (loadError || !survey) {
        return (
            <div className="ms-wrap">
                <div className="ms-hero">
                    <h1>설문에 접근할 수 없습니다</h1>
                    <p className="ms-subtitle">{loadError || '존재하지 않는 설문입니다.'}</p>
                </div>
            </div>
        );
    }

    if (Number(survey.isActive) !== 1) {
        return (
            <div className="ms-wrap">
                <div className="ms-hero">
                    <div className="ms-eyebrow">The Next Fellowship · {survey.round}회차</div>
                    <h1>{survey.title}</h1>
                    <p className="ms-subtitle">현재 이 설문은 접수가 마감되었습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ms-wrap">
            <section className="ms-hero">
                <div className="ms-eyebrow">The Next Fellowship · {survey.round}회차 · 대학생 멘토</div>
                <h1>{survey.title}</h1>
                <p className="ms-subtitle">강원도 홍천 지역 고등학생을 위한 진로·전공 멘토링 프로그램에 함께해 주세요.</p>
                <div className="ms-meta">
                    {survey.eventDate && (
                        <div><span className="label">일시</span><span className="value">{survey.eventDate}</span></div>
                    )}
                    {survey.location && (
                        <div><span className="label">장소</span><span className="value">{survey.location}</span></div>
                    )}
                    {survey.capacity && (
                        <div><span className="label">모집</span><span className="value">{survey.capacity}</span></div>
                    )}
                    <div><span className="label">지원</span><span className="value">교통비 지급 · 공익 네트워크 참여 · 활동 확인서 발급</span></div>
                </div>
            </section>

            <section className="ms-intro">
                {survey.description ? (
                    survey.description.split('\n').map((p, i) => (p ? <p key={i}>{p}</p> : null))
                ) : (
                    <>
                        <p><strong>The Next Fellowship</strong>는 지방에서 성장하는 청소년들이 자신의 꿈과 정체성을 자유롭게 탐색할 수 있도록 마련된 포럼형 교육 프로그램입니다.</p>
                        <p>대학에서 전공 학업에 매진하고 계신 멘토님께 <strong>① 전공 선택의 이유, ② 캠퍼스 생활의 실제, ③ 고교 시절 준비 과정</strong>을 후배들과 솔직하게 나누어 주시기를 정중히 요청드립니다.</p>
                        <p>본 행사는 사단법인 인순이와 좋은 사람들의 공익 프로젝트로, 수익을 목적으로 하지 않는 순수 교육 기부 활동입니다.</p>
                    </>
                )}
            </section>

            {submitted ? (
                <section className="ms-success">
                    <h2>신청이 완료되었습니다</h2>
                    <p>
                        소중한 시간 내어 신청해 주셔서 감사합니다.<br />
                        학생 보드 멤버 검토 후 개별 안내드리겠습니다.
                    </p>
                </section>
            ) : (
                <form className="ms-form" onSubmit={handleSubmit}>
                    <div className="ms-section-title">1. 기본 정보</div>

                    <div className="ms-row">
                        <div className="ms-field">
                            <label className="q" htmlFor="name">이름<span className="req">*</span></label>
                            <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} placeholder="홍길동" />
                        </div>
                        <div className="ms-field">
                            <label className="q" htmlFor="phone">휴대폰 번호<span className="req">*</span></label>
                            <input type="tel" id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="010-0000-0000" />
                        </div>
                    </div>

                    <div className="ms-field">
                        <label className="q" htmlFor="email">이메일<span className="req">*</span></label>
                        <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} placeholder="example@email.com" />
                    </div>

                    <div className="ms-row">
                        <div className="ms-field">
                            <label className="q" htmlFor="university">소속 대학교<span className="req">*</span></label>
                            <input type="text" id="university" name="university" required value={form.university} onChange={handleChange} placeholder="○○대학교" />
                        </div>
                        <div className="ms-field">
                            <label className="q" htmlFor="grade">학년<span className="req">*</span></label>
                            <select id="grade" name="grade" required value={form.grade} onChange={handleChange}>
                                <option value="">선택해 주세요</option>
                                <option>1학년</option>
                                <option>2학년</option>
                                <option>3학년</option>
                                <option>4학년</option>
                                <option>휴학 중</option>
                                <option>대학원생</option>
                            </select>
                        </div>
                    </div>

                    <div className="ms-field">
                        <label className="q" htmlFor="major">전공(학과)<span className="req">*</span>
                            <span className="hint">AI·데이터·소프트웨어·인지과학 등 관련 전공이라면 모두 환영합니다.</span>
                        </label>
                        <input type="text" id="major" name="major" required value={form.major} onChange={handleChange} placeholder="예) 인공지능학과, 컴퓨터공학과 AI트랙, 데이터사이언스 융합전공 등" />
                    </div>

                    <div className="ms-section-title">2. 참여 가능 여부</div>

                    <div className="ms-field">
                        <label className="q">행사 일정에 참석 가능하신가요?<span className="req">*</span></label>
                        <div className="ms-radio-group">
                            <label>
                                <input type="radio" name="attendance" value="가능" required checked={form.attendance === '가능'} onChange={handleChange} /> 가능합니다
                            </label>
                            <label>
                                <input type="radio" name="attendance" value="조정 필요" required checked={form.attendance === '조정 필요'} onChange={handleChange} /> 일정 조정이 필요합니다
                            </label>
                        </div>
                    </div>

                    <div className="ms-field">
                        <label className="q" htmlFor="transport">교통편</label>
                        <select id="transport" name="transport" value={form.transport} onChange={handleChange}>
                            <option value="">선택해 주세요</option>
                            <option>대중교통 이용 예정</option>
                            <option>자차 이용 예정</option>
                            <option>운영진 차량 동승 희망</option>
                            <option>아직 미정</option>
                        </select>
                    </div>

                    <div className="ms-section-title">3. 자기소개 & 지원 동기</div>

                    <div className="ms-field">
                        <label className="q" htmlFor="motivation">지원 동기<span className="req">*</span>
                            <span className="hint">지역 고등학생들에게 멘토로 함께하고 싶은 이유를 자유롭게 적어주세요. (200~400자)</span>
                        </label>
                        <textarea id="motivation" name="motivation" required value={form.motivation} onChange={handleChange} placeholder="예) 저 역시 고향이 지방이라…" />
                    </div>

                    <div className="ms-field">
                        <label className="q" htmlFor="shareStory">후배들과 나누고 싶은 이야기<span className="req">*</span>
                            <span className="hint">전공 선택 이유 / 입시 준비 과정 / 캠퍼스 생활에서 인상 깊었던 점 중 한 가지를 골라 한두 문단으로 적어주세요.</span>
                        </label>
                        <textarea id="shareStory" name="shareStory" required value={form.shareStory} onChange={handleChange} placeholder="예) 고등학교 시절 수학·과학에 흥미가 있었지만 AI를 직접 접해본 적은 없었습니다. 1학년 때 처음…" />
                    </div>

                    <div className="ms-field">
                        <label className="q" htmlFor="experience">멘토링/봉사 경험 (있는 경우만)
                            <span className="hint">필수는 아닙니다. 간단히 작성해 주세요.</span>
                        </label>
                        <textarea id="experience" name="experience" value={form.experience} onChange={handleChange} placeholder="예) 교내 신입생 멘토링 1년, 지역아동센터 학습 멘토링 6개월 등" />
                    </div>

                    <div className="ms-section-title">4. 개인정보 수집·이용 동의</div>

                    <div className="ms-consent-box">
                        <h4>개인정보 수집 및 이용 동의 안내</h4>
                        <p>사단법인 인순이와 좋은 사람들은 「개인정보 보호법」에 따라 다음과 같이 개인정보를 수집·이용합니다.</p>
                        <ul>
                            <li><strong>수집 항목:</strong> 이름, 연락처(휴대폰), 이메일, 소속 대학·전공·학년, 지원 내용</li>
                            <li><strong>수집 목적:</strong> 멘토 선발 심사, 행사 운영 안내, 활동 확인서 발급, 교통비 지급</li>
                            <li><strong>보유·이용 기간:</strong> 행사 종료 후 1년간 보관 후 파기</li>
                            <li><strong>거부 권리:</strong> 동의를 거부하실 수 있으나, 거부 시 신청 접수가 어렵습니다.</li>
                        </ul>
                        <h4 style={{ marginTop: '12px' }}>사진·영상 활용 동의 (선택)</h4>
                        <ul>
                            <li>행사 진행 중 촬영된 사진 및 영상은 <strong>The Next Fellowship 프로젝트 페이지</strong> 및 <strong>프로그램 공식 SNS 게시용</strong>으로 활용될 수 있습니다.</li>
                            <li>활용 범위: 사단법인 활동 보고, 프로그램 후기·아카이빙 콘텐츠, 비영리 홍보 게시물 제작 등.</li>
                            <li>상업적 목적이나 제3자 제공에는 사용되지 않으며, 비동의 시에도 멘토 활동에는 영향이 없습니다.</li>
                        </ul>
                    </div>

                    <div className="ms-check-group">
                        <label>
                            <input type="checkbox" name="consentPersonal" checked={form.consentPersonal} onChange={handleChange} />
                            <span>(필수) 개인정보 수집·이용에 동의합니다.</span>
                        </label>
                        <label>
                            <input type="checkbox" name="consentImage" checked={form.consentImage} onChange={handleChange} />
                            <span>(선택) 행사 중 촬영된 사진·영상이 프로젝트 페이지 및 프로그램 SNS에 게시되는 것에 동의합니다.</span>
                        </label>
                    </div>

                    {submitError && (
                        <div className="ms-error">{submitError}</div>
                    )}

                    <div className="ms-submit-row">
                        <button type="submit" disabled={submitting}>
                            {submitting ? '제출 중…' : '신청서 제출하기'}
                        </button>
                        <p className="ms-submit-note">
                            제출 후 영업일 기준 7일 이내 개별 연락드립니다.<br />
                            문의 : 사단법인 인순이와 좋은 사람들 사무국
                        </p>
                    </div>
                </form>
            )}

            <footer className="ms-footer">
                © 사단법인 인순이와 좋은 사람들 · The Next Fellowship
            </footer>
        </div>
    );
};

export default MentorSurvey;
