import { useState, useEffect } from 'react';
import { fetchTopics, fetchVotes, type Topic, type VoteRecord } from '../utils/apiClient';

const VoteAdmin = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [votes, setVotes] = useState<VoteRecord[]>([]);

    const loadData = async () => {
        try {
            const [topicsData, votesData] = await Promise.all([
                fetchTopics(),
                fetchVotes()
            ]);
            setTopics(topicsData);
            setVotes(votesData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalVotes = topics.reduce((sum, item) => sum + item.votes, 0);

    const downloadCSV = (topic: Topic, topicVotes: VoteRecord[]) => {
        const headers = ["신청자 성명,연락처,선택한 주제,신청 일시"];
        const rows = topicVotes.map(vote => {
            const date = new Date(vote.createdAt).toLocaleString();
            return `"${vote.name}","${vote.phone}","${topic.title}","${date}"`;
        });

        const csvContent = headers.concat(rows).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        const safeTitle = topic.title.replace(/[^a-z0-9가-힣]/gi, '_');
        link.setAttribute("download", `topic_applicants_${safeTitle}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="admin-card">
            <div className="admin-header">
                <h3>주제신청 현황 (총 {totalVotes}건)</h3>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>주제명</th>
                        <th>제안자</th>
                        <th>신청 수</th>
                        <th>비율</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.sort((a, b) => b.votes - a.votes).map(topic => {
                        const percentage = totalVotes === 0 ? 0 : ((topic.votes / totalVotes) * 100).toFixed(1);
                        return (
                            <tr key={topic.id}>
                                <td style={{ fontWeight: '600' }}>{topic.title}</td>
                                <td>{topic.authorName}</td>
                                <td>{topic.votes}건</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '100px', height: '8px', background: 'var(--admin-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percentage}%`, height: '100%', background: '#3b82f6' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{percentage}%</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: '50px' }}>
                <div className="admin-header">
                    <h3>주제별 신청 현황</h3>
                </div>

                {topics.sort((a, b) => b.votes - a.votes).map(topic => {
                    const topicVotes = votes.filter(v => v.topicId === topic.id);

                    return (
                        <div key={topic.id} style={{ marginBottom: '40px', background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                                <h4 style={{ margin: 0, color: 'var(--color-neon-lime)' }}>
                                    {topic.title} <span style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem', marginLeft: '10px' }}>({topicVotes.length}명 신청)</span>
                                </h4>
                                {topicVotes.length > 0 && (
                                    <button
                                        onClick={() => downloadCSV(topic, topicVotes)}
                                        style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '4px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        엑셀 다운로드 (CSV)
                                    </button>
                                )}
                            </div>

                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>신청자 성명</th>
                                        <th>연락처</th>
                                        <th>신청 일시</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topicVotes.map(vote => (
                                        <tr key={vote.id}>
                                            <td style={{ fontWeight: '500' }}>{vote.name}</td>
                                            <td>{vote.phone}</td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>{new Date(vote.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {topicVotes.length === 0 && (
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-sub)' }}>아직 이 주제에 대한 신청 기록이 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VoteAdmin;
