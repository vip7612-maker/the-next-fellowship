import { useState, useEffect, useMemo } from 'react';
import { ROUND_BOUNDARIES, currentRound as currentEventRound } from '../utils/rounds';
import { fetchApplicantTranscript } from '../utils/apiClient';
import { fetchApplicants, getTargetCapacity, saveTargetCapacity, updateApplicantStatus } from '../utils/apiClient';
import type { Applicant } from '../utils/apiClient';
import { formatPhone } from '../utils/formatPhone';
import { SmsModal } from './SmsModal';

interface GroupedApplicant extends Applicant {
    applyCount: number;
    responses: {
        careerReason: string;
        motivation: string;
        questionForYoon: string;
        date: string;
    }[];
}

const ApplicantList = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [deletedApplicants, setDeletedApplicants] = useState<Applicant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [targetCapacity, setTargetCapacity] = useState(10);
    const [selectedApplicant, setSelectedApplicant] = useState<GroupedApplicant | null>(null);
    const [showDeleted, setShowDeleted] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [loadError, setLoadError] = useState('');
    const [activeRound, setActiveRound] = useState<number>(() => currentEventRound());
    const [transcriptBusyId, setTranscriptBusyId] = useState<string | null>(null);
    const [showSmsModal, setShowSmsModal] = useState(false);

    const handleViewTranscript = async (id: string | number, fileName?: string | null) => {
        setTranscriptBusyId(String(id));
        try {
            const data = await fetchApplicantTranscript(id);
            const safeName = (fileName || data.transcriptFileName || `${data.name || 'transcript'}`).replace(/[^\w가-힣.\-_ ]+/g, '_');

            // 1순위: Blob URL (현재 방식)
            if (data.transcriptUrl) {
                const w = window.open(data.transcriptUrl, '_blank', 'noopener,noreferrer');
                if (!w) {
                    const a = document.createElement('a');
                    a.href = data.transcriptUrl;
                    a.download = safeName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
                return;
            }

            // 2순위: 레거시 dataUrl (Vercel Blob 도입 이전 데이터)
            if (data.transcriptDataUrl) {
                const arr = data.transcriptDataUrl.split(',');
                const mime = (arr[0].match(/:(.*?);/) || [])[1] || data.transcriptMimeType || 'application/octet-stream';
                const bin = atob(arr[1]);
                const u8 = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
                const blob = new Blob([u8], { type: mime });
                const url = URL.createObjectURL(blob);
                const w = window.open(url, '_blank', 'noopener,noreferrer');
                if (!w) {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = safeName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
                setTimeout(() => URL.revokeObjectURL(url), 60_000);
                return;
            }

            throw new Error('첨부된 파일이 없습니다.');
        } catch (err) {
            alert(err instanceof Error ? err.message : '첨부 파일을 불러오지 못했습니다.');
        } finally {
            setTranscriptBusyId(null);
        }
    };

    const loadApplicants = async () => {
        setLoadError('');
        try {
            const apps = await fetchApplicants();
            const activeApps = apps.filter(a => a.status !== 'Deleted');
            const deletedApps = apps.filter(a => a.status === 'Deleted').map(a => ({ ...a, deletedAt: a.date }));
            setApplicants(activeApps);
            setDeletedApplicants(deletedApps);
        } catch (error: any) {
            console.error('신청자 목록 로드 실패:', error);
            setLoadError('신청자 목록을 불러오지 못했습니다. 새로고침 해주세요.');
        }
    };

    useEffect(() => {
        loadApplicants();
        setTargetCapacity(getTargetCapacity());
    }, []);

    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            setTargetCapacity(val);
            saveTargetCapacity(val);
        }
    };

    const groupedApplicants = useMemo(() => {
        const roundFiltered = applicants.filter(a => (a.round ?? 1) === activeRound);
        const map = roundFiltered.reduce((acc, app) => {
            const key = `${app.name}_${app.phone}`;
            if (!acc[key]) {
                acc[key] = {
                    ...app,
                    applyCount: 1,
                    responses: [{
                        careerReason: app.careerReason,
                        motivation: app.motivation,
                        questionForYoon: app.questionForYoon,
                        date: app.date || ''
                    }]
                };
            } else {
                acc[key].applyCount += 1;
                acc[key].responses.push({
                    careerReason: app.careerReason,
                    motivation: app.motivation,
                    questionForYoon: app.questionForYoon,
                    date: app.date || ''
                });
            }
            return acc;
        }, {} as Record<string, GroupedApplicant>);
        return Object.values(map);
    }, [applicants, activeRound]);

    const deletedByRound = useMemo(
        () => deletedApplicants.filter(a => (a.round ?? 1) === activeRound),
        [deletedApplicants, activeRound]
    );

    const filteredApplicants = useMemo(() => groupedApplicants.filter(a => {
        if (statusFilter && statusFilter !== 'all') {
            if (statusFilter === 'deleted') return false;
            if (a.status !== statusFilter) return false;
        }
        if (searchTerm) {
            return a.name.includes(searchTerm) ||
                a.school.includes(searchTerm) ||
                a.responses.some(r => (r.careerReason && r.careerReason.includes(searchTerm)) || (r.motivation && r.motivation.includes(searchTerm)));
        }
        return true;
    }), [groupedApplicants, statusFilter, searchTerm]);

    const toggleStatus = async (id: number | string, newStatus: Applicant['status']) => {
        try {
            await updateApplicantStatus(id, newStatus);
            setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } catch (error: any) {
            alert('상태 업데이트 실패: ' + error.message);
        }
    };

    const handleDelete = async (app: GroupedApplicant) => {
        if (!confirm(`"${app.name}" 신청자를 삭제하시겠습니까?\n삭제된 신청자는 삭제자 목록에서 관리됩니다.`)) return;
        
        try {
            const matchingApps = applicants.filter(a => a.name === app.name && a.phone === app.phone);
            
            // 데이터베이스 상태를 'Deleted'로 업데이트
            for (const matchingApp of matchingApps) {
                await updateApplicantStatus(matchingApp.id, 'Deleted');
            }
            
            await loadApplicants(); // 최신 DB 상태로 화면 갱신
        } catch (error: any) {
            alert('삭제 업데이트 실패: ' + error.message);
        }
    };

    const handleRestore = async (app: Applicant) => {
        if (!confirm(`"${app.name}" 신청자를 복원하시겠습니까?`)) return;
        
        try {
            // DB에 동일 인물의 모든 복원 대상 찾기 (deletedApplicants에서 찾음)
            const matchingApps = deletedApplicants.filter(a => a.name === app.name && a.phone === app.phone);
            
            for (const matchingApp of matchingApps) {
                await updateApplicantStatus(matchingApp.id, 'Pending');
            }
            
            await loadApplicants();
        } catch (error: any) {
            alert('복원 업데이트 실패: ' + error.message);
        }
    };

    const downloadCSV = () => {
        const headers = ["이름,학교,연락처,이메일,신청횟수,희망진로/이유(최신),지원동기(최신),사전질문(최신),상태,최근신청일"];
        const rows = filteredApplicants.map(app => {
            // Escape quotes and commas in texts
            const escapedCareerReason = `"${(app.careerReason || '').replace(/"/g, '""')}"`;
            const escapedMotivation = `"${(app.motivation || '').replace(/"/g, '""')}"`;
            const escapedQuestion = `"${(app.questionForYoon || '').replace(/"/g, '""')}"`;
            return `${app.name},${app.school},${formatPhone(app.phone)},${app.email},${app.applyCount},${escapedCareerReason},${escapedMotivation},${escapedQuestion},${app.status},${app.date || ''}`;
        });

        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `applicants_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Statistics calculations (현재 선택된 회차 기준)
    const totalUniqueApplicants = groupedApplicants.length;
    const totalRawApplications = applicants.filter(a => (a.round ?? 1) === activeRound).length;
    const pendingCount = groupedApplicants.filter(a => a.status === 'Pending').length;
    const selectedCount = groupedApplicants.filter(a => a.status === 'Selected').length;
    const waitlistCount = groupedApplicants.filter(a => a.status === 'Waitlist').length;
    const deletedCount = deletedByRound.length;

    const roundCount = (r: number) => applicants.filter(a => (a.round ?? 1) === r).length;
    const allRounds = useMemo(() => {
        const set = new Set<number>();
        applicants.forEach(a => set.add(a.round ?? 1));
        ROUND_BOUNDARIES.forEach(b => set.add(b.round));
        set.add(currentEventRound());
        return Array.from(set).sort((a, b) => a - b);
    }, [applicants]);

    const handleStatClick = (filter: string | null) => {
        setStatusFilter(prev => prev === filter ? null : filter);
    };

    return (
        <div>
            {loadError && (
                <div style={{ padding: '12px 16px', marginBottom: '16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {loadError}</span>
                    <button onClick={loadApplicants} style={{ background: 'none', border: '1px solid #dc2626', borderRadius: '4px', color: '#dc2626', padding: '4px 10px', cursor: 'pointer', fontSize: '0.85rem' }}>다시 시도</button>
                </div>
            )}

            {/* 회차 탭 (회차가 끝나면 자동으로 다음 회차 추가) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {allRounds.map(r => {
                    const isCurrent = r === currentEventRound();
                    return (
                        <button
                            key={r}
                            onClick={() => { setActiveRound(r); setStatusFilter(null); }}
                            style={{
                                padding: '10px 28px',
                                borderRadius: '8px',
                                border: activeRound === r ? 'none' : '1px solid var(--admin-border)',
                                background: activeRound === r ? '#3b82f6' : 'white',
                                color: activeRound === r ? 'white' : '#64748b',
                                fontWeight: activeRound === r ? 700 : 400,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {r}회차{isCurrent && ' (당회차)'}
                            <span style={{ marginLeft: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
                                ({roundCount(r)}명)
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Statistics Cards - Clickable Filters */}
            <div className="stats-dashboard">
                <div className="stats-cards">
                    <div className={`stat-card stat-card-total ${statusFilter === null ? 'stat-active' : ''}`} onClick={() => handleStatClick(null)} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <div className="stat-number">{totalUniqueApplicants}</div>
                            <div className="stat-label">전체</div>
                        </div>
                        {totalRawApplications !== totalUniqueApplicants && (
                            <div className="stat-sub">총 {totalRawApplications}건</div>
                        )}
                    </div>
                    <div className={`stat-card stat-card-pending ${statusFilter === 'Pending' ? 'stat-active' : ''}`} onClick={() => handleStatClick('Pending')} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <div className="stat-number">{pendingCount}</div>
                            <div className="stat-label">대기중</div>
                        </div>
                    </div>
                    <div className={`stat-card stat-card-selected ${statusFilter === 'Selected' ? 'stat-active' : ''}`} onClick={() => handleStatClick('Selected')} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <div className="stat-number">{selectedCount}</div>
                            <div className="stat-label">선발</div>
                        </div>
                    </div>
                    <div className={`stat-card stat-card-waitlist ${statusFilter === 'Waitlist' ? 'stat-active' : ''}`} onClick={() => handleStatClick('Waitlist')} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <div className="stat-number">{waitlistCount}</div>
                            <div className="stat-label">예비</div>
                        </div>
                    </div>
                    <div className={`stat-card stat-card-deleted ${statusFilter === 'deleted' ? 'stat-active' : ''}`} onClick={() => { handleStatClick('deleted'); setShowDeleted(true); }} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon">🗑️</div>
                        <div className="stat-info">
                            <div className="stat-number">{deletedCount}</div>
                            <div className="stat-label">삭제됨</div>
                        </div>
                    </div>
                </div>
                {statusFilter && (
                    <div style={{ marginBottom: '10px', padding: '8px 16px', background: '#eff6ff', borderRadius: '8px', fontSize: '0.85rem', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>🔍 필터: <strong>{statusFilter === 'Pending' ? '대기중' : statusFilter === 'Selected' ? '선발' : statusFilter === 'Waitlist' ? '예비' : statusFilter === 'deleted' ? '삭제됨' : statusFilter}</strong> 신청자만 표시</span>
                        <button onClick={() => setStatusFilter(null)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>✕ 필터 해제</button>
                    </div>
                )}
            </div>

            {/* Applicant List */}
            <div className="admin-card">
            <div className="admin-header" style={{ flexWrap: 'wrap', gap: '20px' }}>
                <h3>{activeRound}회차 신청자 관리 ({filteredApplicants.length}명)</h3>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--admin-bg)', padding: '5px 15px', borderRadius: '4px', border: '1px solid var(--admin-border)' }}>
                        <label style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' }}>목표 정원:</label>
                        <input
                            type="number"
                            min="1"
                            value={targetCapacity}
                            onChange={handleCapacityChange}
                            style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid var(--admin-border)', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>명</span>
                    </div>

                    <input
                        type="text"
                        placeholder="이름, 학교, 전공 검색..."
                        className="admin-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px 15px', borderRadius: '4px', border: '1px solid var(--admin-border)', width: '200px' }}
                    />
                    <button
                        onClick={downloadCSV}
                        style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: '500' }}
                    >
                        엑셀 다운로드 (CSV)
                    </button>
                    <button
                        onClick={() => setShowSmsModal(true)}
                        disabled={filteredApplicants.length === 0}
                        style={{ padding: '8px 15px', borderRadius: '4px', border: 'none', background: filteredApplicants.length === 0 ? '#cbd5e1' : '#10b981', color: 'white', cursor: filteredApplicants.length === 0 ? 'not-allowed' : 'pointer', fontWeight: '500' }}
                    >
                        📨 문자 발송 ({filteredApplicants.length}명)
                    </button>
                </div>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>학교</th>
                        <th>연락처</th>
                        <th>이메일</th>
                        <th>희망진로/동기/질문 요약</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplicants.map(app => (
                        <tr key={app.id}>
                            <td style={{ fontWeight: '600' }}>
                                {app.name}
                                {app.transcriptFileName && (
                                    <div style={{ marginTop: 4 }}>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleViewTranscript(app.id, app.transcriptFileName); }}
                                            disabled={transcriptBusyId === String(app.id)}
                                            title={`생기부: ${app.transcriptFileName}`}
                                            style={{
                                                fontSize: '0.7rem',
                                                color: '#2b5b3a',
                                                background: '#eaf1ec',
                                                border: '1px solid rgba(43,91,58,0.3)',
                                                padding: '2px 8px',
                                                borderRadius: 999,
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            📎 생기부
                                        </button>
                                    </div>
                                )}
                                {app.applyCount > 1 && (
                                    <div style={{ marginTop: '5px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: '10px' }}>
                                            {app.applyCount}회 신청
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td>{app.school}</td>
                            <td style={{ fontSize: '0.85rem' }}>{formatPhone(app.phone)}</td>
                            <td style={{ fontSize: '0.85rem' }}>{app.email}</td>
                            <td>
                                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} title={app.careerReason}><strong>진로:</strong> {app.careerReason}</div>
                                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} title={app.motivation}><strong>동기:</strong> {app.motivation}</div>
                                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} title={app.questionForYoon}><strong>질문:</strong> {app.questionForYoon}</div>
                            </td>
                            <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                            <td>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button
                                        onClick={() => setSelectedApplicant(app)}
                                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--admin-border)', background: 'white', cursor: 'pointer', fontSize: '0.8rem', color: '#334155' }}
                                    >
                                        상세보기
                                    </button>
                                    <select
                                        value={app.status}
                                        onChange={(e) => toggleStatus(app.id, e.target.value as Applicant['status'])}
                                        style={{ padding: '4px', borderRadius: '4px' }}
                                    >
                                        <option value="Pending">대기</option>
                                        <option value="Selected">선발</option>
                                        <option value="Waitlist">예비</option>
                                    </select>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(app)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedApplicant && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setSelectedApplicant(null)}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>지원자 상세 정보</h3>
                            <button onClick={() => setSelectedApplicant(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '15px', fontSize: '0.95rem' }}>
                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>이름</div>
                            <div style={{ color: '#0f172a' }}>{selectedApplicant.name}</div>

                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>학교</div>
                            <div style={{ color: '#0f172a' }}>{selectedApplicant.school}</div>

                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>연락처</div>
                            <div style={{ color: '#0f172a' }}>{formatPhone(selectedApplicant.phone)}</div>

                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>이메일</div>
                            <div style={{ color: '#0f172a' }}>{selectedApplicant.email || '-'}</div>

                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>생기부</div>
                            <div>
                                {selectedApplicant.transcriptFileName ? (
                                    <button
                                        type="button"
                                        onClick={() => handleViewTranscript(selectedApplicant.id, selectedApplicant.transcriptFileName)}
                                        disabled={transcriptBusyId === String(selectedApplicant.id)}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 8,
                                            padding: '6px 12px',
                                            background: '#eaf1ec',
                                            border: '1px solid #2b5b3a',
                                            color: '#2b5b3a',
                                            borderRadius: 6,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        📎 {selectedApplicant.transcriptFileName}
                                        <span style={{ color: '#64748b', fontWeight: 400 }}>
                                            ({selectedApplicant.transcriptSizeBytes ? `${Math.round(selectedApplicant.transcriptSizeBytes / 1024)}KB` : '-'})
                                        </span>
                                        <span style={{ marginLeft: 4, fontSize: '0.78rem' }}>
                                            {transcriptBusyId === String(selectedApplicant.id) ? '여는 중…' : '열기 / 다운로드'}
                                        </span>
                                    </button>
                                ) : (
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>첨부 없음</span>
                                )}
                            </div>

                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>상태</div>
                            <div><span className={`badge ${selectedApplicant.status}`}>{selectedApplicant.status}</span></div>

                            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--admin-border)', margin: '10px 0' }}></div>

                            <div style={{ fontWeight: 'bold', color: '#0f172a', gridColumn: '1 / -1', fontSize: '1.1rem', marginTop: '10px' }}>
                                누적 신청 응답 내역 <span style={{ color: '#ef4444' }}>({selectedApplicant.applyCount}회)</span>
                            </div>

                            {selectedApplicant.responses.map((resp, idx) => (
                                <div key={idx} style={{ gridColumn: '1 / -1', background: 'var(--admin-bg)', padding: '15px', borderRadius: '8px', marginBottom: '5px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        [{selectedApplicant.applyCount - idx}회차 지원] <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal', marginLeft: '5px' }}>{resp.date}</span>
                                    </div>

                                    <div style={{ fontWeight: 'bold', color: '#64748b', fontSize: '0.9rem', marginBottom: '4px' }}>희망하는 진로와 그 이유</div>
                                    <div style={{ lineHeight: '1.6', whiteSpace: 'pre-line', color: '#334155', marginBottom: '15px', fontSize: '0.95rem' }}>{resp.careerReason}</div>

                                    <div style={{ fontWeight: 'bold', color: '#64748b', fontSize: '0.9rem', marginBottom: '4px' }}>프로그램 지원 동기</div>
                                    <div style={{ lineHeight: '1.6', whiteSpace: 'pre-line', color: '#334155', marginBottom: '15px', fontSize: '0.95rem' }}>{resp.motivation}</div>

                                    <div style={{ fontWeight: 'bold', color: '#64748b', fontSize: '0.9rem', marginBottom: '4px' }}>현업 전문가에게 하고 싶은 질문</div>
                                    <div style={{ lineHeight: '1.6', whiteSpace: 'pre-line', color: '#334155', fontSize: '0.95rem' }}>{resp.questionForYoon}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '25px', textAlign: 'right' }}>
                            <button
                                onClick={() => setSelectedApplicant(null)}
                                style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: '500' }}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>

            {showSmsModal && (
                <SmsModal
                    applicants={filteredApplicants}
                    onClose={() => setShowSmsModal(false)}
                />
            )}

            {/* Deleted Applicants Section */}
            <div className="admin-card deleted-section" style={{ marginTop: '30px' }}>
                <div
                    className="deleted-section-header"
                    onClick={() => setShowDeleted(!showDeleted)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                >
                    <h3 style={{ margin: 0 }}>🗑️ 삭제자 관리 — {activeRound}회차 ({deletedCount}명)</h3>
                    <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: showDeleted ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </div>
                {showDeleted && (
                    <div style={{ marginTop: '20px' }}>
                        {deletedByRound.length === 0 ? (
                            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>삭제된 신청자가 없습니다.</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>이름</th>
                                        <th>학교</th>
                                        <th>연락처</th>
                                        <th>이메일</th>
                                        <th>삭제 전 상태</th>
                                        <th>삭제일시</th>
                                        <th>관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deletedByRound.map(app => (
                                        <tr key={app.id} style={{ opacity: 0.7 }}>
                                            <td style={{ fontWeight: '600' }}>{app.name}</td>
                                            <td>{app.school}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{formatPhone(app.phone)}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{app.email}</td>
                                            <td><span className={`badge ${app.status}`}>{app.status}</span></td>
                                            <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                {app.deletedAt ? new Date(app.deletedAt).toLocaleString('ko-KR') : '-'}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-restore"
                                                    onClick={() => handleRestore(app)}
                                                >
                                                    복원
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicantList;
