import { useState, useEffect } from 'react';
import { getApplicants, saveApplicants, getTargetCapacity, saveTargetCapacity } from './mockData';
import type { Applicant } from './mockData';

const ApplicantList = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [targetCapacity, setTargetCapacity] = useState(10);

    useEffect(() => {
        setApplicants(getApplicants());
        setTargetCapacity(getTargetCapacity());
    }, []);

    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            setTargetCapacity(val);
            saveTargetCapacity(val);
        }
    };

    const filteredApplicants = applicants.filter(a =>
        a.name.includes(searchTerm) ||
        a.school.includes(searchTerm) ||
        (a.careerReason && a.careerReason.includes(searchTerm))
    );

    const toggleStatus = (id: number, newStatus: Applicant['status']) => {
        setApplicants(prev => {
            const updated = prev.map(a =>
                a.id === id ? { ...a, status: newStatus } : a
            );
            saveApplicants(updated);
            return updated;
        });
    };

    const downloadCSV = () => {
        const headers = ["이름,학교,연락처,이메일,희망진로/이유,지원동기,사전질문,상태,신청일"];
        const rows = filteredApplicants.map(app => {
            // Escape quotes and commas in texts
            const escapedCareerReason = `"${(app.careerReason || '').replace(/"/g, '""')}"`;
            const escapedMotivation = `"${(app.motivation || '').replace(/"/g, '""')}"`;
            const escapedQuestion = `"${(app.questionForYoon || '').replace(/"/g, '""')}"`;
            return `${app.name},${app.school},${app.phone},${app.email},${escapedCareerReason},${escapedMotivation},${escapedQuestion},${app.status},${app.date || ''}`;
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
                            <td style={{ fontWeight: '600' }}>{app.name}</td>
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
                                <select
                                    value={app.status}
                                    onChange={(e) => toggleStatus(app.id, e.target.value as Applicant['status'])}
                                    style={{ padding: '4px', borderRadius: '4px' }}
                                >
                                    <option value="Pending">대기</option>
                                    <option value="Selected">선발</option>
                                    <option value="Waitlist">예비</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicantList;
