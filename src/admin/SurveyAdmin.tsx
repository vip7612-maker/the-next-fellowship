import { useState, useEffect } from 'react';
import { fetchSurveys } from '../utils/apiClient';
import type { Survey } from '../utils/apiClient';
import './Admin.css';

const SurveyAdmin = () => {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const SURVEY_URL = "https://vip7612-maker.github.io/the-next-fellowship/#/survey";
    const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(SURVEY_URL)}`;

    useEffect(() => {
        loadSurveys();
    }, []);

    const loadSurveys = async () => {
        setIsLoading(true);
        try {
            const data = await fetchSurveys();
            setSurveys(data);
        } catch (err: any) {
            setError(err.message || '설문 데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h2 className="admin-title">설문 및 QR 관리</h2>
                <div className="admin-actions">
                    <button className="export-btn" onClick={loadSurveys}>새로고침</button>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="stats-grid" style={{ marginBottom: '30px' }}>
                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>프로그램 참석자 설문용 QR 코드</h3>
                    <p style={{ marginBottom: '20px', color: 'var(--color-text-sub)' }}>
                        이 QR 코드를 화면에 띄우거나 출력하여 참석자들이 설문을 진행할 수 있도록 안내해주세요.
                    </p>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                        <img src={QR_CODE_URL} alt="설문조사 QR 코드" width="250" height="250" />
                    </div>
                    <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                        {SURVEY_URL}
                    </a>
                </div>
            </div>

            {/* Results Table Section */}
            <div className="admin-card">
                <h3 style={{ marginBottom: '20px' }}>설문 결과 목록 (총 {surveys.length}건)</h3>
                
                {isLoading ? (
                    <div className="loading-state">데이터를 불러오는 중입니다...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : surveys.length === 0 ? (
                    <div className="empty-state">아직 제출된 설문이 없습니다.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '120px' }}>제출일시</th>
                                    <th style={{ width: '100px' }}>도움정도</th>
                                    <th style={{ width: '35%' }}>좋았던 점 (피드백)</th>
                                    <th style={{ width: '35%' }}>발전적 의견</th>
                                </tr>
                            </thead>
                            <tbody>
                                {surveys.map((survey) => (
                                    <tr key={survey.id}>
                                        <td>{new Date(survey.createdAt).toLocaleString('ko-KR', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}</td>
                                        <td>{survey.helpfulness}점</td>
                                        <td>
                                            <div style={{ maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                                {survey.feedback}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                                {survey.constructiveOpinion}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurveyAdmin;
