import './Pipeline.css';

const Pipeline = () => {
    return (
        <section className="pipeline-section" id="pipeline">
            <div className="container">
                <div className="intro-badge neon-text" style={{ marginBottom: '30px' }}>PROGRAM DETAILS</div>
                <h2 className="section-title" style={{ marginBottom: '60px' }}>넥스트 펠로우십 <span className="neon-text">프로그램 상세</span></h2>

                <div className="philosophy-pipeline">
                    {/* Step 01 - 컨설팅 (후킹 포인트 → 먼저 노출) */}
                    <div className="pipeline-step step-3">
                        <div className="step-indicator">STEP 01</div>
                        <div className="step-content">
                            <h3>실행과 전략 <span className="step-subtitle">Actionable Strategy</span></h3>
                            <h4 className="step-role purple-text">윤앤고 윤여정 대표의 진학 컨설팅</h4>
                            <p>내가 원하는 학교와 학과에 진학하기 위해 지금 당장 필요한 것이 무엇인지, 윤앤고 입시전략팀이 체계적이고 현실적인 맞춤형 진학 컨설팅을 제공합니다.</p>
                        </div>
                    </div>

                    <div className="pipeline-connector">
                        <div className="connector-line"></div>
                        <div className="connector-arrow">↓</div>
                    </div>

                    {/* Step 02 - 멘토링 */}
                    <div className="pipeline-step step-2">
                        <div className="step-indicator">STEP 02</div>
                        <div className="step-content">
                            <h3>실전 멘토링 <span className="step-subtitle">Practical Mentoring</span></h3>
                            <h4 className="step-role blue-text">목표 대학/전공 재학생 멘토링</h4>
                            <p>그 진로를 위해 목표 대학에 진학하여 공부하고 있는 나와 가까운 언니, 오빠, 누나, 동생 멘토들이 생생한 경험담과 밀착 조언을 제공합니다.</p>
                        </div>
                    </div>

                    <div className="pipeline-connector">
                        <div className="connector-line"></div>
                        <div className="connector-arrow">↓</div>
                    </div>

                    {/* Step 03 - 비전 */}
                    <div className="pipeline-step step-1">
                        <div className="step-indicator">STEP 03</div>
                        <div className="step-content">
                            <h3>비전과 영감 <span className="step-subtitle">Vision & Inspiration</span></h3>
                            <h4 className="step-role neon-text">해당 분야 최고 전문가 강연</h4>
                            <p>이미 그 분야에서 사회적으로 성공적인 행보를 보이고 있는 강연자들이 여러분의 진로와 삶의 시야를 넓혀줄 깊이 있는 통찰과 비전을 나눕니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pipeline;
