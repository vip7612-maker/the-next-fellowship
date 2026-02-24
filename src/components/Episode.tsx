import './Episode.css';

const Episode = () => {
    return (
        <section className="episode" id="episode">
            <div className="container">
                <div className="episode-header">
                    <div className="date-tag">3월 21일 (목) - 차세대 커리어 포럼</div>
                    <h2 className="section-title">하나의 세션, <span className="neon-text">두 개의 세계</span></h2>
                    <p className="section-desc">반도체 공학자와 콘텐츠 마케터가 만나 여러분의 가능성을 확장합니다.</p>
                </div>

                <div className="speaker-clash">
                    <div className="speaker-card left">
                        <div className="speaker-img-placeholder">반도체 전문가</div>
                        <div className="speaker-info">
                            <span className="field-tag">Semiconductor</span>
                            <h3>김혁진 박사</h3>
                            <p>초미세 공정의 미래와 우리 삶의 변화</p>
                        </div>
                    </div>

                    <div className="clash-vs">VS</div>

                    <div className="speaker-card right">
                        <div className="speaker-img-placeholder">마케팅 전문가</div>
                        <div className="speaker-info">
                            <span className="field-tag">Marketing</span>
                            <h3>이기쁨 디렉터</h3>
                            <p>Z세대를 움직이는 콘텐츠의 힘</p>
                        </div>
                    </div>
                </div>

                <div className="mentors-grid">
                    <div className="mentor-item">
                        <div className="mentor-circle">U</div>
                        <div className="mentor-name">서울대 전자공학 연주원</div>
                    </div>
                    <div className="mentor-item">
                        <div className="mentor-circle">U</div>
                        <div className="mentor-name">연세대 경영학 한가람</div>
                    </div>
                    <div className="mentor-item">
                        <div className="mentor-circle">C</div>
                        <div className="mentor-name">윤앤고 입시전략팀</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Episode;
