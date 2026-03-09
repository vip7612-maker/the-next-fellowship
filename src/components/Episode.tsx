import './Episode.css';

const Episode = () => {
    return (
        <section className="episode" id="episode">
            <div className="container">


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

                        <div className="person-item" style={{ borderBottom: 'none', paddingTop: '20px' }}>
                            <div className="person-name" style={{ color: 'var(--color-text-sub)', fontSize: '1.1rem', fontWeight: 500, lineHeight: '1.6' }}>
                                참가자들의 꿈과 목표에 가장 잘 맞는<br />
                                <strong style={{ color: 'var(--color-white)' }}>최적의 멘토를 매칭중입니다.</strong>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Consulting */}
                    <div className="episode-card theme-pink">
                        <div className="card-icon">컨설팅</div>
                        <h3 className="card-title">데이터 기반 진학 나침반</h3>

                        <div className="person-item">
                            <div className="person-role">Consulting Group</div>
                            <div className="person-name">윤여정 대표</div>
                            <div className="person-desc">윤앤고 입시전략팀<br />개인별 생기부 분석 및 밀착 입시 컨설팅</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Episode;
