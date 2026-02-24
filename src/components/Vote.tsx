import './Vote.css';

const Vote = () => {
    const options = [
        { id: 1, title: '우주 항공 & 천문학', votes: '124', icon: '🚀' },
        { id: 2, title: '심리학 & 행동 경제학', votes: '89', icon: '🧠' },
        { id: 3, title: '환경 에너지 & ESG', votes: '56', icon: '🌱' },
        { id: 4, title: '방송 제작 & 뉴미디어', votes: '112', icon: '🎥' }
    ];

    return (
        <section className="vote" id="vote">
            <div className="container">
                <h2 className="section-title">다음 스테이지의 <span className="neon-text">주인공을</span><br />직접 정해주세요</h2>
                <p className="section-desc">가장 궁금한 분야에 투표하세요. 여러분의 목소리가 다음 펠로우십의 주제가 됩니다.</p>

                <div className="vote-grid">
                    {options.map(option => (
                        <div key={option.id} className="vote-card">
                            <div className="vote-icon">{option.icon}</div>
                            <h4>{option.title}</h4>
                            <div className="vote-count">{option.votes}명이 투표함</div>
                            <button className="vote-btn">투표하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Vote;
