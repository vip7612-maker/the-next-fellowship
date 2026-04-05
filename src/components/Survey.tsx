import React, { useState } from 'react';
import { submitSurvey } from '../utils/apiClient';
import Navbar from './Navbar';
import './Application.css'; // Reusing form styles

const Survey = () => {
    const [formData, setFormData] = useState({
        helpfulness: '10',
        feedback: '',
        constructiveOpinion: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.feedback || !formData.constructiveOpinion) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }

        try {
            await submitSurvey({
                name: '익명',
                phone: '',
                satisfaction: parseInt(formData.helpfulness, 10), // Satisfaction is mapped to helpfulness to please the DB constraint
                helpfulness: parseInt(formData.helpfulness, 10),
                feedback: formData.feedback,
                constructiveOpinion: formData.constructiveOpinion
            });
            setIsSubmitted(true);
        } catch (error: any) {
            alert(error.message || "설문 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '100px' }}>
                <section className="application">
                    <div className="container">
                        <div className="session-header-top" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 5vw, 60px)', padding: '0 15px' }}>
                            <h3 className="session-title-top" style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', lineHeight: '1.3', marginBottom: '10px', wordBreak: 'keep-all' }}>
                                프로그램 <span className="neon-text">만족도 설문조사</span>
                            </h3>
                            <p className="session-desc-top" style={{ fontSize: '1.2rem', color: 'var(--color-text-sub)' }}>
                                여러분의 소중한 의견이 다음 프로그램을 더욱 풍성하게 만듭니다.
                            </p>
                        </div>

                        <div className="application-box" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {isSubmitted ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--color-accent)' }}>설문이 완료되었습니다! 👏</h2>
                                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--color-text-sub)' }}>
                                        소중한 시간 내어 의견을 남겨주셔서 진심으로 감사드립니다.<br />
                                        보내주신 피드백을 바탕으로 더 발전하는 펠로우십이 되겠습니다.
                                    </p>
                                    <div style={{ marginTop: '40px' }}>
                                        <a href="#/" className="cta-button-main" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                            홈으로 돌아가기
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <form className="application-form-preview" onSubmit={handleSubmit}>
                                        <div className="form-field" style={{ marginBottom: '25px', marginTop: '20px' }}>
                                            <label>이 프로그램이 귀하에게 얼마나 도움이 되었나요? (1~10점) *</label>
                                            <select name="helpfulness" value={formData.helpfulness} onChange={handleChange} required
                                                style={{ width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                                                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                                                    <option key={num} value={num} style={{ color: 'black' }}>{num}점</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-field">
                                            <label>어떤 점이 좋았나요? 인상 깊었던 점 등 피드백을 남겨주세요. *</label>
                                            <textarea name="feedback" placeholder="프로그램을 통해 얻은 긍정적인 경험이나 좋았던 점들을 자세히 적어주세요." value={formData.feedback} onChange={handleChange} required style={{ minHeight: '120px' }}></textarea>
                                        </div>

                                        <div className="form-field">
                                            <label>보완해야 할 점이나 발전적인 의견을 적어주세요. *</label>
                                            <textarea name="constructiveOpinion" placeholder="더 나은 프로그램이 되기 위해 개선이 필요한 점이나 추가되었으면 하는 점을 자유롭게 적어주세요." value={formData.constructiveOpinion} onChange={handleChange} required style={{ minHeight: '120px' }}></textarea>
                                        </div>

                                        <button type="submit" className="cta-button-main full-width">설문 제출하기</button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
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
        </>
    );
};

export default Survey;
