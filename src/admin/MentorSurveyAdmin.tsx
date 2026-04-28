import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
    fetchMentorSurveys,
    createMentorSurvey,
    updateMentorSurvey,
    deleteMentorSurvey,
    fetchMentorResponses,
    type MentorSurvey,
    type MentorSurveyResponse
} from '../utils/apiClient';
import './Admin.css';

const buildPublicUrl = (id: string) => {
    // 배포 환경: HashRouter 기반 — /#/mentor-apply/:id
    const origin = window.location.origin;
    const base = window.location.pathname.replace(/index\.html$/, '');
    return `${origin}${base}#/mentor-apply/${id}`;
};

const buildQrUrl = (target: string, size = 280) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(target)}`;

const MentorSurveyAdmin = () => {
    const [surveys, setSurveys] = useState<MentorSurvey[]>([]);
    const [responsesBySurvey, setResponsesBySurvey] = useState<Record<string, MentorSurveyResponse[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        round: '',
        title: '대학생 멘토 모집 신청서',
        eventDate: '',
        location: '',
        capacity: 'AI융합 관련 전공 대학생 2명',
        description: ''
    });

    const [expandedSurveyId, setExpandedSurveyId] = useState<string | null>(null);
    const [responseModalSurveyId, setResponseModalSurveyId] = useState<string | null>(null);

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await fetchMentorSurveys();
            setSurveys(list);
            // 각 설문의 응답 수 캐싱(병렬)
            const entries = await Promise.all(
                list.map(async (s) => {
                    try {
                        const res = await fetchMentorResponses(s.id);
                        return [s.id, res] as const;
                    } catch {
                        return [s.id, []] as const;
                    }
                })
            );
            setResponsesBySurvey(Object.fromEntries(entries));
        } catch (err) {
            const msg = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        if (!createForm.round || !createForm.title) {
            alert('회차와 제목은 필수입니다.');
            return;
        }
        const roundNum = Number(createForm.round);
        if (!Number.isInteger(roundNum) || roundNum < 1) {
            alert('회차는 1 이상의 정수여야 합니다.');
            return;
        }
        setCreating(true);
        try {
            await createMentorSurvey({
                round: roundNum,
                title: createForm.title,
                eventDate: createForm.eventDate,
                location: createForm.location,
                capacity: createForm.capacity,
                description: createForm.description
            });
            setShowCreate(false);
            setCreateForm({
                round: '',
                title: '대학생 멘토 모집 신청서',
                eventDate: '',
                location: '',
                capacity: 'AI융합 관련 전공 대학생 2명',
                description: ''
            });
            await loadAll();
        } catch (err) {
            alert(err instanceof Error ? err.message : '설문 생성에 실패했습니다.');
        } finally {
            setCreating(false);
        }
    };

    const handleToggleActive = async (survey: MentorSurvey) => {
        try {
            await updateMentorSurvey(survey.id, { isActive: Number(survey.isActive) === 1 ? false : true });
            await loadAll();
        } catch (err) {
            alert(err instanceof Error ? err.message : '상태 변경에 실패했습니다.');
        }
    };

    const handleDelete = async (survey: MentorSurvey) => {
        const count = responsesBySurvey[survey.id]?.length ?? 0;
        const msg = count > 0
            ? `[${survey.round}회차] 설문을 삭제하시겠습니까?\n응답 ${count}건도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.`
            : `[${survey.round}회차] 설문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`;
        if (!confirm(msg)) return;
        try {
            await deleteMentorSurvey(survey.id);
            await loadAll();
        } catch (err) {
            alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('링크가 복사되었습니다.');
        } catch {
            prompt('링크를 복사하세요:', text);
        }
    };

    const handlePrint = (survey: MentorSurvey, url: string) => {
        const w = window.open('', '_blank', 'width=600,height=800');
        if (!w) return;
        const qr = buildQrUrl(url, 480);
        w.document.write(`
            <html><head><title>${survey.round}회차 멘토 신청 QR</title>
            <style>
              body { font-family: -apple-system, "Apple SD Gothic Neo", sans-serif; text-align: center; padding: 40px; }
              h1 { font-size: 24px; margin-bottom: 8px; }
              p { color: #555; margin: 4px 0; }
              .qr { margin: 32px 0; }
              .url { font-size: 12px; color: #666; word-break: break-all; }
            </style></head><body>
              <h1>${survey.round}회차 · ${survey.title}</h1>
              ${survey.eventDate ? `<p>${survey.eventDate}</p>` : ''}
              ${survey.location ? `<p>${survey.location}</p>` : ''}
              <div class="qr"><img src="${qr}" alt="QR" /></div>
              <p class="url">${url}</p>
              <script>setTimeout(() => window.print(), 600);</script>
            </body></html>
        `);
        w.document.close();
    };

    const responseModalSurvey = useMemo(
        () => surveys.find((s) => s.id === responseModalSurveyId) || null,
        [surveys, responseModalSurveyId]
    );
    const modalResponses = responseModalSurveyId ? responsesBySurvey[responseModalSurveyId] ?? [] : [];

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h2 className="admin-title">멘토 설문 · QR 관리 (회차별)</h2>
                <div className="admin-actions" style={{ display: 'flex', gap: 10 }}>
                    <button className="export-btn" onClick={loadAll}>새로고침</button>
                    <button
                        className="export-btn"
                        style={{ background: '#2b5b3a', color: '#fff' }}
                        onClick={() => setShowCreate((v) => !v)}
                    >
                        {showCreate ? '닫기' : '＋ 새 회차 설문 만들기'}
                    </button>
                </div>
            </div>

            {showCreate && (
                <div className="admin-card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginTop: 0, marginBottom: 16 }}>새 회차 설문 생성</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                            회차 *
                            <input
                                type="number"
                                min={1}
                                required
                                value={createForm.round}
                                onChange={(e) => setCreateForm({ ...createForm, round: e.target.value })}
                                placeholder="예) 3"
                                style={inputStyle}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                            설문 제목 *
                            <input
                                type="text"
                                required
                                value={createForm.title}
                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                style={inputStyle}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                            행사 일시
                            <input
                                type="text"
                                value={createForm.eventDate}
                                onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
                                placeholder="예) 2026년 5월 17일(일) 14:00–17:00"
                                style={inputStyle}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                            장소
                            <input
                                type="text"
                                value={createForm.location}
                                onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                                placeholder="예) 홍천읍 꽃신"
                                style={inputStyle}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, gridColumn: '1 / -1' }}>
                            모집 안내
                            <input
                                type="text"
                                value={createForm.capacity}
                                onChange={(e) => setCreateForm({ ...createForm, capacity: e.target.value })}
                                style={inputStyle}
                            />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, gridColumn: '1 / -1' }}>
                            상단 안내문 (선택, 빈 값이면 기본 문구 사용)
                            <textarea
                                value={createForm.description}
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </label>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setShowCreate(false)} className="export-btn">취소</button>
                            <button type="submit" disabled={creating} className="export-btn" style={{ background: '#2b5b3a', color: '#fff' }}>
                                {creating ? '생성 중…' : '생성하기'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="loading-state">데이터를 불러오는 중입니다...</div>
            ) : error ? (
                <div className="error-state">{error}</div>
            ) : surveys.length === 0 ? (
                <div className="admin-card">
                    <div className="empty-state" style={{ padding: 40, textAlign: 'center' }}>
                        아직 생성된 회차 설문이 없습니다.<br />
                        우측 상단 <strong>＋ 새 회차 설문 만들기</strong> 버튼으로 시작하세요.
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 18 }}>
                    {surveys.map((survey) => {
                        const url = buildPublicUrl(survey.id);
                        const qr = buildQrUrl(url, 220);
                        const responseCount = responsesBySurvey[survey.id]?.length ?? 0;
                        const isExpanded = expandedSurveyId === survey.id;
                        const active = Number(survey.isActive) === 1;

                        return (
                            <div key={survey.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 0 }}>
                                    <div style={{
                                        background: '#f8fafc', borderRight: '1px solid var(--admin-border)',
                                        padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10
                                    }}>
                                        <div style={{ background: 'white', padding: 10, borderRadius: 10 }}>
                                            <img src={qr} alt={`${survey.round}회차 QR`} width={200} height={200} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handlePrint(survey, url)}
                                            className="export-btn"
                                            style={{ width: '100%' }}
                                        >
                                            🖨 QR 인쇄/저장
                                        </button>
                                    </div>

                                    <div style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                            <div>
                                                <div style={{ fontSize: 12, letterSpacing: '0.12em', color: '#2b5b3a', fontWeight: 700, marginBottom: 4 }}>
                                                    {survey.round}회차 · {active ? '접수 중' : '마감됨'}
                                                </div>
                                                <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{survey.title}</h3>
                                                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
                                                    {survey.eventDate && <div>📅 {survey.eventDate}</div>}
                                                    {survey.location && <div>📍 {survey.location}</div>}
                                                    {survey.capacity && <div>👥 {survey.capacity}</div>}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 11, color: '#888' }}>응답</div>
                                                <div style={{ fontSize: 28, fontWeight: 700, color: '#2b5b3a' }}>{responseCount}</div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 14, padding: '10px 12px', background: '#faf8f4', border: '1px solid #e5e3de', borderRadius: 8, fontSize: 12.5, color: '#444', wordBreak: 'break-all' }}>
                                            {url}
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                                            <button className="export-btn" onClick={() => handleCopy(url)}>🔗 링크 복사</button>
                                            <a className="export-btn" href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                                ↗ 새 탭에서 열기
                                            </a>
                                            <button
                                                className="export-btn"
                                                onClick={() => setResponseModalSurveyId(survey.id)}
                                                disabled={responseCount === 0}
                                            >
                                                📋 응답 보기 ({responseCount})
                                            </button>
                                            <button
                                                className="export-btn"
                                                onClick={() => handleToggleActive(survey)}
                                                style={{ background: active ? '#fdecec' : '#eaf1ec', color: active ? '#8a2727' : '#2b5b3a' }}
                                            >
                                                {active ? '⏸ 접수 마감' : '▶ 접수 재개'}
                                            </button>
                                            <button
                                                className="export-btn"
                                                onClick={() => setExpandedSurveyId(isExpanded ? null : survey.id)}
                                            >
                                                {isExpanded ? '▲ 접기' : '⚙ 상세/삭제'}
                                            </button>
                                        </div>

                                        {isExpanded && (
                                            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--admin-border)', fontSize: 13, color: '#555' }}>
                                                <div>설문 ID: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{survey.id}</code></div>
                                                <div>생성일: {new Date(survey.createdAt).toLocaleString('ko-KR')}</div>
                                                <div style={{ marginTop: 12 }}>
                                                    <button
                                                        className="export-btn"
                                                        onClick={() => handleDelete(survey)}
                                                        style={{ background: '#fdecec', color: '#8a2727' }}
                                                    >
                                                        🗑 설문 영구 삭제
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {responseModalSurvey && (
                <div
                    onClick={() => setResponseModalSurveyId(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white', borderRadius: 12, maxWidth: 1100, width: '100%',
                            maxHeight: '85vh', display: 'flex', flexDirection: 'column'
                        }}
                    >
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{responseModalSurvey.round}회차 응답 ({modalResponses.length}건)</h3>
                            <button className="export-btn" onClick={() => setResponseModalSurveyId(null)}>닫기</button>
                        </div>
                        <div style={{ overflow: 'auto', padding: 0 }}>
                            {modalResponses.length === 0 ? (
                                <div className="empty-state" style={{ padding: 40, textAlign: 'center' }}>아직 응답이 없습니다.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>제출일시</th>
                                                <th>이름</th>
                                                <th>연락처</th>
                                                <th>이메일</th>
                                                <th>대학/학년</th>
                                                <th>전공</th>
                                                <th>참석</th>
                                                <th>교통</th>
                                                <th>지원동기</th>
                                                <th>나누고 싶은 이야기</th>
                                                <th>경험</th>
                                                <th>이미지동의</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalResponses.map((r) => (
                                                <tr key={r.id}>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        {new Date(r.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td>{r.name}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{r.phone}</td>
                                                    <td>{r.email}</td>
                                                    <td>{r.university} {r.grade}</td>
                                                    <td>{r.major}</td>
                                                    <td>{r.attendance}</td>
                                                    <td>{r.transport}</td>
                                                    <td><div style={cellStyle}>{r.motivation}</div></td>
                                                    <td><div style={cellStyle}>{r.shareStory}</div></td>
                                                    <td><div style={cellStyle}>{r.experience}</div></td>
                                                    <td>{Number(r.consentImage) === 1 ? '✔' : '–'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    border: '1px solid var(--admin-border)',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: 'inherit',
    color: 'var(--admin-text)',
    background: '#fff'
};

const cellStyle: React.CSSProperties = {
    maxWidth: 240,
    maxHeight: 100,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.4,
    fontSize: 13
};

export default MentorSurveyAdmin;
