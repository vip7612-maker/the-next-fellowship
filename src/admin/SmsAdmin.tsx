import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
    fetchApplicants,
    fetchSmsTemplates,
    createSmsTemplate,
    updateSmsTemplate,
    deleteSmsTemplate,
    fetchSmsLogs,
    fetchSmsLogDetail,
    sendSms,
    type Applicant,
    type SmsTemplate,
    type SmsSendLog,
    type SmsSendRecipient,
} from '../utils/apiClient';
import './Admin.css';

type Tab = 'send' | 'templates' | 'logs';

const getByteLength = (s: string) => {
    let b = 0;
    for (let i = 0; i < s.length; i++) b += s.charCodeAt(i) <= 0x7F ? 1 : 2;
    return b;
};

const isValidKoreanPhone = (raw: string) => /^01[016789]\d{7,8}$/.test(String(raw).replace(/[^0-9]/g, ''));

// 1:1 테스트 발송용 프리셋 본문
const PRESET_TEST_MESSAGES: { key: string; label: string; text: string }[] = [
    {
        key: 'confirm-r2',
        label: '✅ 2회차 참석 확정',
        text:
`[더 넥스트 펠로우십]

{이름}님, 반가워요 🙌
2회차 「AI 융합 — 내가 좋아하는 그것에, AI를 더하는 순간」 에 오시는 걸 환영합니다.

📆 5월 17일(일) 14:00–17:00
📍 홍천읍 꽃신
   강원특별자치도 홍천군 홍천읍 홍천로5길 10
🎤 이경진 강사 · 대학생 멘토 · 이상연 입시 컨설턴트

· 13:30부터 입장 가능합니다
· 못 오시게 되면 미리 알려주세요!

당일 만나요 ✨
- 인순이와 좋은 사람들 -`
    },
    {
        key: 'introduce-friend',
        label: '💌 친구 소개',
        text:
`야, 나 이번 일요일(5/17) 「더 넥스트 펠로우십」 2회차 가는데
너도 같이 가자!

「AI 융합 — 내가 좋아하는 그것에, AI를 더하는 순간」
📆 5/17(일) 14:00–17:00
📍 홍천읍 꽃신
🎤 강사 + 대학생 멘토 + 입시 컨설턴트

👉 https://the-next-fellowship.vercel.app`
    },
];

const SmsAdmin = () => {
    const [tab, setTab] = useState<Tab>('send');

    // 공통: 신청자 데이터 (대상 선택용)
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loadingApps, setLoadingApps] = useState(true);

    // 템플릿
    const [templates, setTemplates] = useState<SmsTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);

    // 발송 이력
    const [logs, setLogs] = useState<SmsSendLog[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [selectedLog, setSelectedLog] = useState<(SmsSendLog & { recipients: SmsSendRecipient[] }) | null>(null);

    // 새 발송 상태
    const [round, setRound] = useState<number | 'all'>(1);
    const [content, setContent] = useState('');
    const [memo, setMemo] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<string>('');

    // 템플릿 편집
    const [editingTemplate, setEditingTemplate] = useState<{ id?: string; title: string; content: string; category: string } | null>(null);

    // 1:1 테스트 발송 (임시 — 임의 번호로 한 건 발송)
    const [testPhone, setTestPhone] = useState('');
    const [testName, setTestName] = useState('테스트');
    const [testContent, setTestContent] = useState('');
    const [testSending, setTestSending] = useState(false);
    const [testResult, setTestResult] = useState('');

    useEffect(() => {
        loadApplicants();
    }, []);

    useEffect(() => {
        if (tab === 'templates') loadTemplates();
        if (tab === 'logs') loadLogs();
    }, [tab]);

    const loadApplicants = async () => {
        setLoadingApps(true);
        try {
            const data = await fetchApplicants();
            setApplicants(data.filter(a => a.status !== 'Deleted'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingApps(false);
        }
    };

    const loadTemplates = async () => {
        setLoadingTemplates(true);
        try {
            setTemplates(await fetchSmsTemplates());
        } finally {
            setLoadingTemplates(false);
        }
    };

    const loadLogs = async () => {
        setLoadingLogs(true);
        try {
            setLogs(await fetchSmsLogs());
        } finally {
            setLoadingLogs(false);
        }
    };

    const allRounds = useMemo(() => {
        const set = new Set<number>();
        applicants.forEach(a => set.add(a.round ?? 1));
        return Array.from(set).sort((a, b) => a - b);
    }, [applicants]);

    // 발송 대상 (이름+번호 중복 제거 + 유효 번호만)
    const targets = useMemo(() => {
        const filtered = round === 'all' ? applicants : applicants.filter(a => (a.round ?? 1) === round);
        const seen = new Set<string>();
        const valid: { name: string; phone: string }[] = [];
        for (const a of filtered) {
            const phone = String(a.phone).replace(/[^0-9]/g, '');
            const name = String(a.name).trim();
            const key = name + '_' + phone;
            if (seen.has(key)) continue;
            seen.add(key);
            if (isValidKoreanPhone(phone)) valid.push({ name, phone });
        }
        return valid;
    }, [applicants, round]);

    const invalidTargets = useMemo(() => {
        const filtered = round === 'all' ? applicants : applicants.filter(a => (a.round ?? 1) === round);
        const seen = new Set<string>();
        const out: { name: string; phone: string }[] = [];
        for (const a of filtered) {
            const phone = String(a.phone).replace(/[^0-9]/g, '');
            const name = String(a.name).trim();
            const key = name + '_' + phone;
            if (seen.has(key)) continue;
            seen.add(key);
            if (!isValidKoreanPhone(phone)) out.push({ name, phone: String(a.phone) });
        }
        return out;
    }, [applicants, round]);

    const byteLen = getByteLength(content);
    const isLms = byteLen > 90;

    const handleApplyTemplate = (id: string) => {
        setSelectedTemplateId(id);
        if (!id) return;
        const t = templates.find(x => x.id === id);
        if (t) setContent(t.content);
    };

    const handleSend = async () => {
        if (!content.trim()) { alert('메시지 내용을 입력해 주세요.'); return; }
        if (targets.length === 0) { alert('발송 대상이 없습니다.'); return; }

        const confirmMsg = `[${round === 'all' ? '전체' : round + '회차'}] ${targets.length}명에게 ${isLms ? 'LMS 장문' : 'SMS 단문'} 발송합니다.\n\n계속하시겠습니까?`;
        if (!confirm(confirmMsg)) return;

        setSending(true);
        setSendResult('');
        try {
            const messages = targets.map(t => ({
                to: t.phone,
                text: content.replace(/{이름}/g, t.name),
                name: t.name,
            }));
            const result = await sendSms(messages, {
                templateId: selectedTemplateId || undefined,
                title: memo || undefined,
                targetType: round === 'all' ? 'all' : `round${round}`,
                content,
            });
            setSendResult(`✅ 발송 등록 완료 (총 ${result.count}건 / 성공 ${result.successCount} / 실패 ${result.failCount})`);
        } catch (err: any) {
            setSendResult(`❌ 발송 실패: ${err.message}`);
        } finally {
            setSending(false);
        }
    };

    // 1:1 테스트 발송
    const handleTestSend = async () => {
        const cleanPhone = testPhone.replace(/[^0-9]/g, '');
        if (!isValidKoreanPhone(cleanPhone)) { alert('수신 번호 형식이 올바르지 않습니다.'); return; }
        if (!testContent.trim()) { alert('본문을 입력하거나 프리셋을 선택해 주세요.'); return; }

        const text = testContent.replace(/{이름}/g, testName.trim() || '테스트');
        const isLmsTest = getByteLength(text) > 90;
        if (!confirm(`${cleanPhone} 으로 ${isLmsTest ? 'LMS 장문' : 'SMS 단문'} 1건을 발송합니다. 계속할까요?`)) return;

        setTestSending(true);
        setTestResult('');
        try {
            const result = await sendSms(
                [{ to: cleanPhone, text, name: testName.trim() || undefined }],
                { targetType: 'test', title: '1:1 테스트', content: text }
            );
            setTestResult(`✅ 발송 등록 완료 (성공 ${result.successCount} / 실패 ${result.failCount})`);
        } catch (err: any) {
            setTestResult(`❌ 발송 실패: ${err.message}`);
        } finally {
            setTestSending(false);
        }
    };

    // 템플릿 저장
    const handleSaveTemplate = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;
        if (!editingTemplate.title.trim() || !editingTemplate.content.trim()) {
            alert('제목과 본문은 필수입니다.');
            return;
        }
        try {
            if (editingTemplate.id) {
                await updateSmsTemplate(editingTemplate.id, {
                    title: editingTemplate.title,
                    content: editingTemplate.content,
                    category: editingTemplate.category
                });
            } else {
                await createSmsTemplate({
                    title: editingTemplate.title,
                    content: editingTemplate.content,
                    category: editingTemplate.category
                });
            }
            setEditingTemplate(null);
            await loadTemplates();
        } catch (err: any) {
            alert(err.message || '저장 실패');
        }
    };

    const handleDeleteTemplate = async (id: string, title: string) => {
        if (!confirm(`"${title}" 템플릿을 삭제하시겠습니까?`)) return;
        try {
            await deleteSmsTemplate(id);
            await loadTemplates();
        } catch (err: any) {
            alert(err.message || '삭제 실패');
        }
    };

    const handleViewLog = async (id: string) => {
        try {
            const detail = await fetchSmsLogDetail(id);
            setSelectedLog(detail);
        } catch (err: any) {
            alert(err.message || '상세 조회 실패');
        }
    };

    const previewText = useMemo(() => {
        if (targets.length === 0) return content;
        return content.replace(/{이름}/g, targets[0].name);
    }, [content, targets]);

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h2 className="admin-title">📨 문자 발송 관리</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--admin-border)' }}>
                {([
                    { key: 'send', label: '✉️ 새 발송' },
                    { key: 'templates', label: '📋 템플릿 관리' },
                    { key: 'logs', label: '🗂 발송 이력' }
                ] as const).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        style={{
                            padding: '10px 18px',
                            border: 'none',
                            borderBottom: tab === t.key ? '3px solid #2b5b3a' : '3px solid transparent',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontWeight: tab === t.key ? 700 : 500,
                            color: tab === t.key ? '#2b5b3a' : '#64748b',
                            fontSize: 15
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* === 새 발송 === */}
            {tab === 'send' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* 1:1 테스트 발송 (임시) */}
                    <div className="admin-card" style={{ borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
                        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            🧪 임의 번호 1:1 테스트 발송
                            <span style={{ fontSize: 12, fontWeight: 500, color: '#92400e', padding: '2px 8px', background: '#fef3c7', borderRadius: 999 }}>
                                실 발송 / 이력에 'test' 로 기록
                            </span>
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <label style={labelStyle}>
                                수신 번호
                                <input
                                    type="tel"
                                    value={testPhone}
                                    onChange={e => setTestPhone(e.target.value)}
                                    placeholder="01012345678"
                                    style={inputStyle}
                                />
                            </label>
                            <label style={labelStyle}>
                                수신자 이름 ({'{이름}'} 치환용)
                                <input
                                    type="text"
                                    value={testName}
                                    onChange={e => setTestName(e.target.value)}
                                    placeholder="테스트"
                                    style={inputStyle}
                                />
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, alignSelf: 'center', color: '#475569' }}>프리셋:</span>
                            {PRESET_TEST_MESSAGES.map(p => (
                                <button
                                    key={p.key}
                                    onClick={() => setTestContent(p.text)}
                                    className="export-btn"
                                    style={{ background: '#fff', borderColor: '#f59e0b' }}
                                >
                                    {p.label}
                                </button>
                            ))}
                            {testContent && (
                                <button
                                    onClick={() => setTestContent('')}
                                    className="export-btn"
                                    style={{ background: '#fff', color: '#94a3b8' }}
                                >
                                    지우기
                                </button>
                            )}
                        </div>

                        <textarea
                            value={testContent}
                            onChange={e => setTestContent(e.target.value)}
                            placeholder="프리셋을 누르거나 직접 입력. {이름}을 쓰면 위 수신자 이름으로 치환됩니다."
                            rows={8}
                            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}
                        />
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <span>{getByteLength(testContent)} Byte ({getByteLength(testContent) > 90 ? 'LMS' : 'SMS'})</span>
                            <span>* 실제로 SMS가 발송되며 발송 이력 탭에 기록됩니다.</span>
                        </div>

                        {testResult && (
                            <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: testResult.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: testResult.startsWith('✅') ? '#15803d' : '#b91c1c', fontSize: 14, fontWeight: 600 }}>
                                {testResult}
                            </div>
                        )}

                        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleTestSend}
                                disabled={testSending || !testPhone || !testContent.trim()}
                                className="export-btn"
                                style={{ background: '#f59e0b', color: '#fff', padding: '10px 20px', fontWeight: 700 }}
                            >
                                {testSending ? '발송 중…' : '🧪 1건 테스트 발송'}
                            </button>
                        </div>
                    </div>

                    {/* 정식 발송 영역 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="admin-card">
                        <h3 style={{ marginTop: 0 }}>1. 발송 대상</h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                            <button onClick={() => setRound('all')} className="export-btn" style={{ background: round === 'all' ? '#2b5b3a' : '#fff', color: round === 'all' ? '#fff' : '#000' }}>
                                전체 ({applicants.length}건)
                            </button>
                            {allRounds.map(r => {
                                const cnt = applicants.filter(a => (a.round ?? 1) === r).length;
                                return (
                                    <button key={r} onClick={() => setRound(r)} className="export-btn" style={{ background: round === r ? '#2b5b3a' : '#fff', color: round === r ? '#fff' : '#000' }}>
                                        {r}회차 ({cnt}건)
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, fontSize: 14 }}>
                            {loadingApps ? '불러오는 중…' : (
                                <>
                                    <div>📤 발송 가능: <strong style={{ fontSize: 22, color: '#2b5b3a' }}>{targets.length}명</strong></div>
                                    {invalidTargets.length > 0 && (
                                        <details style={{ marginTop: 8, color: '#b91c1c' }}>
                                            <summary>⚠️ 번호 오류로 제외 {invalidTargets.length}명</summary>
                                            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                                                {invalidTargets.map((v, i) => <li key={i}>{v.name} — {v.phone}</li>)}
                                            </ul>
                                        </details>
                                    )}
                                </>
                            )}
                        </div>

                        <h3>2. 템플릿 불러오기 (선택)</h3>
                        <select
                            value={selectedTemplateId}
                            onChange={e => handleApplyTemplate(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">— 직접 입력 —</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.title}{t.category ? ` (${t.category})` : ''}</option>
                            ))}
                        </select>

                        <h3 style={{ marginTop: 20 }}>3. 발송 메모 (선택)</h3>
                        <input
                            type="text"
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            placeholder="예) 1회 참가자 2회 홍보"
                            style={inputStyle}
                        />
                    </div>

                    <div className="admin-card">
                        <h3 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            메시지 본문
                            <span style={{ fontSize: 13, fontWeight: 500, color: isLms ? '#ef4444' : '#3b82f6' }}>
                                {byteLen} Byte ({isLms ? 'LMS' : 'SMS'})
                            </span>
                        </h3>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder={'본문 입력. {이름}을 쓰면 수신자 이름으로 자동 치환됩니다.'}
                            rows={14}
                            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}
                        />
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                            * 90Byte 초과 시 LMS 장문(요금 ↑)으로 자동 전환됩니다.
                        </div>

                        {targets.length > 0 && content && (
                            <details style={{ marginTop: 14 }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>👁 미리보기 ({targets[0].name}님 기준)</summary>
                                <pre style={{ background: '#faf8f4', padding: 12, borderRadius: 8, marginTop: 8, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13 }}>
                                    {previewText}
                                </pre>
                            </details>
                        )}

                        {sendResult && (
                            <div style={{ marginTop: 14, padding: 12, borderRadius: 8, background: sendResult.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: sendResult.startsWith('✅') ? '#15803d' : '#b91c1c', fontSize: 14, fontWeight: 600 }}>
                                {sendResult}
                            </div>
                        )}

                        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button onClick={handleSend} disabled={sending || targets.length === 0 || !content.trim()} className="export-btn" style={{ background: '#2b5b3a', color: '#fff', padding: '10px 24px', fontSize: 15, fontWeight: 700 }}>
                                {sending ? '발송 중…' : `📤 ${targets.length}명 발송`}
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            )}

            {/* === 템플릿 관리 === */}
            {tab === 'templates' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                        <button
                            onClick={() => setEditingTemplate({ title: '', content: '', category: '' })}
                            className="export-btn"
                            style={{ background: '#2b5b3a', color: '#fff' }}
                        >
                            ＋ 새 템플릿
                        </button>
                    </div>

                    {loadingTemplates ? (
                        <div className="loading-state">불러오는 중…</div>
                    ) : templates.length === 0 ? (
                        <div className="admin-card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                            아직 등록된 템플릿이 없습니다.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {templates.map(t => (
                                <div key={t.id} className="admin-card" style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                                <h3 style={{ margin: 0, fontSize: 16 }}>{t.title}</h3>
                                                {t.category && <span style={{ fontSize: 11, padding: '2px 8px', background: '#eaf1ec', color: '#2b5b3a', borderRadius: 999, fontWeight: 600 }}>{t.category}</span>}
                                            </div>
                                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13, color: '#475569', maxHeight: 100, overflow: 'auto' }}>{t.content}</pre>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                                                수정 {new Date(t.updatedAt).toLocaleString('ko-KR')}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                            <button onClick={() => setEditingTemplate({ id: t.id, title: t.title, content: t.content, category: t.category || '' })} className="export-btn">수정</button>
                                            <button onClick={() => handleDeleteTemplate(t.id, t.title)} className="export-btn" style={{ background: '#fee2e2', color: '#b91c1c' }}>삭제</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {editingTemplate && (
                        <div onClick={() => setEditingTemplate(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                            <form onClick={e => e.stopPropagation()} onSubmit={handleSaveTemplate} style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 600, width: '100%' }}>
                                <h3 style={{ marginTop: 0 }}>{editingTemplate.id ? '템플릿 수정' : '새 템플릿'}</h3>
                                <label style={labelStyle}>
                                    제목 *
                                    <input type="text" value={editingTemplate.title} onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })} required style={inputStyle} />
                                </label>
                                <label style={labelStyle}>
                                    분류
                                    <input type="text" value={editingTemplate.category} onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value })} placeholder="예) 홍보, 안내, 리마인드" style={inputStyle} />
                                </label>
                                <label style={labelStyle}>
                                    본문 * <span style={{ color: '#64748b', fontWeight: 400 }}>({getByteLength(editingTemplate.content)} Byte / {getByteLength(editingTemplate.content) > 90 ? 'LMS' : 'SMS'})</span>
                                    <textarea value={editingTemplate.content} onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })} rows={10} required style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                                </label>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                                    <button type="button" onClick={() => setEditingTemplate(null)} className="export-btn">취소</button>
                                    <button type="submit" className="export-btn" style={{ background: '#2b5b3a', color: '#fff' }}>저장</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* === 발송 이력 === */}
            {tab === 'logs' && (
                <div>
                    {loadingLogs ? (
                        <div className="loading-state">불러오는 중…</div>
                    ) : logs.length === 0 ? (
                        <div className="admin-card" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                            아직 발송 이력이 없습니다.
                        </div>
                    ) : (
                        <div className="admin-card" style={{ padding: 0 }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>발송일시</th>
                                        <th>대상</th>
                                        <th>인원</th>
                                        <th>성공/실패</th>
                                        <th>유형</th>
                                        <th>제목/메모</th>
                                        <th>본문 미리보기</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.sentAt).toLocaleString('ko-KR')}</td>
                                            <td>{log.targetType}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{log.targetCount}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ color: '#15803d', fontWeight: 700 }}>{log.successCount}</span> / <span style={{ color: '#b91c1c', fontWeight: 700 }}>{log.failCount}</span>
                                            </td>
                                            <td>{log.isLms ? 'LMS' : 'SMS'}</td>
                                            <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.title || ''}>{log.title || '-'}</td>
                                            <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: '#64748b' }} title={log.content}>{log.content}</td>
                                            <td>
                                                <button onClick={() => handleViewLog(log.id)} className="export-btn" style={{ fontSize: 12 }}>상세</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {selectedLog && (
                        <div onClick={() => setSelectedLog(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                            <div onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: 0, borderRadius: 12, maxWidth: 900, width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0 }}>발송 상세 — {new Date(selectedLog.sentAt).toLocaleString('ko-KR')}</h3>
                                    <button className="export-btn" onClick={() => setSelectedLog(null)}>닫기</button>
                                </div>
                                <div style={{ overflow: 'auto', padding: 20 }}>
                                    <div style={{ marginBottom: 16, fontSize: 14 }}>
                                        <div><strong>대상 유형:</strong> {selectedLog.targetType} / <strong>인원:</strong> {selectedLog.targetCount}명 / <strong>유형:</strong> {selectedLog.isLms ? 'LMS' : 'SMS'}</div>
                                        <div><strong>성공:</strong> <span style={{ color: '#15803d' }}>{selectedLog.successCount}</span> / <strong>실패:</strong> <span style={{ color: '#b91c1c' }}>{selectedLog.failCount}</span></div>
                                        {selectedLog.groupId && <div style={{ fontSize: 12, color: '#64748b' }}><strong>Solapi Group:</strong> {selectedLog.groupId}</div>}
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontWeight: 700, marginBottom: 6 }}>본문</div>
                                        <pre style={{ background: '#faf8f4', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13, margin: 0 }}>{selectedLog.content}</pre>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: 6 }}>수신자 ({selectedLog.recipients.length}명)</div>
                                        <table className="admin-table">
                                            <thead><tr><th>이름</th><th>번호</th><th>상태</th></tr></thead>
                                            <tbody>
                                                {selectedLog.recipients.map(r => (
                                                    <tr key={r.id}>
                                                        <td>{r.name || '-'}</td>
                                                        <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.phone}</td>
                                                        <td><span className={`badge ${r.status === 'success' ? 'Selected' : 'Pending'}`}>{r.status || 'unknown'}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 10,
    border: '1px solid var(--admin-border)',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#fff',
    boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
};

export default SmsAdmin;
