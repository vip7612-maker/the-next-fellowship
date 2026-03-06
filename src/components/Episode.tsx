import './Episode.css';

const Episode = () => {
    return (
        <section className="episode" id="episode">
            <div className="container">
                <div className="episode-header">
                    <div className="intro-badge neon-text" style={{ marginBottom: '30px' }}>
                        제1회 KickOff
                    </div>
                    <h2 className="section-title" style={{ fontSize: '3rem' }}>4월 5일 (일) 14:00-18:00 - <span className="neon-text">Tech X Creators</span></h2>
                    <p className="section-desc">반도체 공학자와 콘텐츠 마케터가 만나 여러분의 가능성을 확장합니다.</p>
                </div>

                <div className="episode-grid">
                    {/* Card 1: Experts */}
                    <div className="episode-card theme-neon">
                        <div className="card-icon">전문가</div>
                        <h3 className="card-title">이번 회차를 이끌어갈 강사진</h3>

                        <div className="person-item">
                            <div className="person-role">Semiconductor</div>
                            <div className="person-name">권정현 개발자</div>
                            <div className="person-desc">AI 시대의 핵심, Custom HBM 디지털 설계</div>
                        </div>

                        <div className="person-item">
                            <div className="person-role">Marketing</div>
                            <div className="person-name">이하희 실장</div>
                            <div className="person-desc">IP 가치를 극대화하는 글로벌 전략 마케팅</div>
                        </div>
                    </div>

                    {/* Card 2: Mentors */}
                    <div className="episode-card theme-blue">
                        <div className="card-icon">멘토</div>
                        <h3 className="card-title">함께 고민을 나눌 대학생 멘토</h3>

                        <div className="person-item">
                            <div className="person-role">Mentor</div>
                            <div className="person-name">서울대 연주원</div>
                            <div className="person-desc">전자공학</div>
                        </div>

                        <div className="person-item">
                            <div className="person-role">Mentor</div>
                            <div className="person-name">연세대 한가람</div>
                            <div className="person-desc">경영학</div>
                        </div>
                    </div>

                    {/* Card 3: Consulting */}
                    <div className="episode-card theme-pink">
                        <div className="card-icon">컨설팅</div>
                        <h3 className="card-title">데이터 기반 진학 나침반</h3>

                        <div className="person-item">
                            <div className="person-role">Consulting Group</div>
                            <div className="person-name">윤앤고 입시전략팀</div>
                            <div className="person-desc">개인별 생기부 분석 및 밀착 입시 컨설팅</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Episode;
