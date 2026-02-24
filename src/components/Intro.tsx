import './Intro.tsx';

const Intro = () => {
    return (
        <section className="intro" id="intro">
            <div className="container">
                <div className="intro-badge neon-text">PROGRAM PHILOSOPHY</div>
                <h2 className="section-title">
                    지방이라서? 고등학생이라서?<br />
                    그런 한계는 <span className="blue-text">우리가 깰게요.</span>
                </h2>
                <div className="intro-grid">
                    <div className="intro-text">
                        <p>
                            단순히 지식을 배우는 곳이 아닙니다. '나는 누구인가'를 고민하고,
                            정형화된 입시를 넘어 나만의 인생 경로를 설계하는 사고의 기반을 닦는 여정입니다.
                        </p>
                        <p>
                            인순이와 좋은 사람들의 다문화/다양성 철학을 바탕으로,
                            우리는 모든 가능성이 존중받는 세상을 꿈꿉니다.
                        </p>
                    </div>
                    <div className="intro-stats">
                        <div className="stat-card">
                            <h3>2 fields</h3>
                            <p>매 세션 두 개의 전공 탐색</p>
                        </div>
                        <div className="stat-card">
                            <h3>3 steps</h3>
                            <p>컨설팅-멘토링-강연 입체 구성</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Intro;
