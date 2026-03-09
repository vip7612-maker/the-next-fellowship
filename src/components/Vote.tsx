import { useState, useEffect } from 'react';
import { getTopics, addTopic, addTopicVote, type Topic, getTargetCapacity } from '../admin/mockData';
import './Vote.css';

const Vote = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [targetCapacity, setTargetCapacity] = useState(10);
    const [viewAll, setViewAll] = useState(false);
    const [voteModalOpen, setVoteModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [proposeModalOpen, setProposeModalOpen] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const loadTopics = () => {
        setTopics(getTopics());
        setTargetCapacity(getTargetCapacity());
    };

    useEffect(() => {
        loadTopics();
    }, []);

    const handleVoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTopic === null) return;
        try {
            addTopicVote(selectedTopic, name, phone);
            alert("주제 신청이 완료되었습니다!");
            setVoteModalOpen(false);
            setName(''); setPhone('');
            loadTopics();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleProposeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            addTopic({ title: newTitle, description: newDesc, authorName: name, authorPhone: phone });
            alert("새 주제 제안이 완료되었습니다!");
            setProposeModalOpen(false);
            setName(''); setPhone(''); setNewTitle(''); setNewDesc('');
            loadTopics();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const sortedTopics = [...topics].sort((a, b) => b.votes - a.votes);
    const displayTopics = viewAll ? sortedTopics : sortedTopics.slice(0, 4);

    return (
        <section className="vote" id="vote">
            <div className="container">
                <div className="intro-badge neon-text" style={{ marginBottom: '20px' }}>NEXT STAGES</div>
                <h2 className="section-title">다음 스테이지의 <span className="neon-text">주인공을</span><br />직접 정해주세요</h2>
                <p className="section-desc">가장 궁금한 분야를 선택해 주제를 신청하세요. 여러분의 목소리가 다음 펠로우십의 주제가 됩니다.</p>

                <div className="vote-actions" style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <button className="secondary-button" onClick={() => setViewAll(!viewAll)} style={{ marginRight: '10px' }}>
                        {viewAll ? 'Top 4만 보기' : '전체 주제 보기'}
                    </button>
                    <button className="cta-button-main" onClick={() => setProposeModalOpen(true)} style={{ border: 'none' }}>
                        + 새로운 주제 제안하기
                    </button>
                </div>

                <div className="vote-grid">
                    {displayTopics.map(topic => {
                        const percentage = targetCapacity > 0 ? Math.round((topic.votes / targetCapacity) * 100) : 0;
                        const barWidth = Math.min(100, percentage);
                        return (
                            <div key={topic.id} className="vote-card">
                                <h4>{topic.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-sub)', marginBottom: '20px', minHeight: '40px' }}>
                                    {topic.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span className="vote-count" style={{ margin: 0, padding: 0 }}>{topic.votes}명이 신청함</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-neon-lime)', fontWeight: '600' }}>{percentage}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '25px' }}>
                                    <div style={{ width: `${barWidth}%`, height: '100%', background: 'var(--color-neon-lime)', borderRadius: '3px', transition: 'width 0.4s ease-out' }}></div>
                                </div>
                                <button className="vote-btn" onClick={() => { setSelectedTopic(topic.id); setVoteModalOpen(true); }}>주제 신청하기</button>
                            </div>
                        );
                    })}
                </div>

                {voteModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>이 주제로 신청하기</h3>
                            <p>중복 방지를 위해 성함과 연락처를 입력해주세요.</p>
                            <form onSubmit={handleVoteSubmit}>
                                <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
                                <input type="tel" placeholder="연락처 (예: 010-1234-5678)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setVoteModalOpen(false)}>취소</button>
                                    <button type="submit" className="submit-btn" style={{ background: 'var(--color-neon-lime)', color: 'var(--color-navy)', border: 'none' }}>신청하기</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {proposeModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>새로운 주제 제안하기</h3>
                            <p>원하시는 강연/토론 주제를 직접 제안해주세요.</p>
                            <form onSubmit={handleProposeSubmit}>
                                <input type="text" placeholder="제안자 이름" value={name} onChange={(e) => setName(e.target.value)} required />
                                <input type="tel" placeholder="연락처 (예: 010-1234-5678)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                <input type="text" placeholder="제안할 주제명" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                                <textarea placeholder="이 주제를 듣고 싶은 사연이나 이유를 적어주세요." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} required style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px', minHeight: '100px', marginBottom: '20px', fontFamily: 'inherit' }}></textarea>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setProposeModalOpen(false)}>취소</button>
                                    <button type="submit" className="submit-btn" style={{ background: 'var(--color-neon-lime)', color: 'var(--color-navy)', border: 'none' }}>제안하기</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Vote;
