import { useState, useEffect } from 'react';
import { getApplicants, getTargetCapacity, saveTargetCapacity, updateApplicantStatus } from './mockData';
import type { Applicant } from './mockData';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [targetCapacity, setTargetCapacity] = useState(10);
    const [selectedApplicant, setSelectedApplicant] = useState<GroupedApplicant | null>(null);

    const loadApplicants = async () => {
        const apps = await getApplicants();
        setApplicants(apps);
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

    const groupedMap = applicants.reduce((acc, app) => {
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

    const groupedApplicants = Object.values(groupedMap);

    const filteredApplicants = groupedApplicants.filter(a =>
        a.name.includes(searchTerm) ||
        a.school.includes(searchTerm) ||
        a.responses.some(r => (r.careerReason && r.careerReason.includes(searchTerm)) || (r.motivation && r.motivation.includes(searchTerm)))
    );

    const toggleStatus = async (id: number | string, newStatus: Applicant['status']) => {
        try {
            await updateApplicantStatus(id, newStatus);
            setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } catch (error: any) {
            alert('상태 업데이트 실패: ' + error.message);
        }
    };

    const downloadCSV = () => {
        const headers = ["이름,학교,연락처,이메일,신청횟수,희망진로/이유(최신),지원동기(최신),사전질문(최신),상태,최근신청일"];
        const rows = filteredApplicants.map(app => {
            // Escape quotes and commas in texts
            const escapedCareerReason = `"${(app.careerReason || '').replace(/"/g, '""')}"`;
            const escapedMotivation = `"${(app.motivation || '').replace(/"/g, '""')}"`;
            const escapedQuestion = `"${(app.questionForYoon || '').replace(/"/g, '""')}"`;
            return `${app.name},${app.school},${app.phone},${app.email},${app.applyCount},${escapedCareerReason},${escapedMotivation},${escapedQuestion},${app.status},${app.date || ''}`;
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

    return (
        <div className="admin-card">
            <div className="admin-header" style={{ flexWrap: 'wrap', gap: '20px' }}>
                <h3>신청자 관리 ({filteredApplicants.length}명)</h3>
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
                                {app.applyCount > 1 && (
                                    <div style={{ marginTop: '5px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: '10px' }}>
                                            {app.applyCount}회 신청
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td>{app.school}</td>
                            <td style={{ fontSize: '0.85rem' }}>{app.phone}</td>
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
                            <div style={{ color: '#0f172a' }}>{selectedApplicant.phone}</div>

                            <div style={{ fontWeight: 'bold', color: '#64748b' }}>이메일</div>
                            <div style={{ color: '#0f172a' }}>{selectedApplicant.email || '-'}</div>

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
    );
};

export default ApplicantList;
