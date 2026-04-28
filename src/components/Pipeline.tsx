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
                            <h4 className="step-role purple-text">윤앤고 입시컨설팅의 1:1 진학 설계</h4>
                            <p>단순한 상담이 아닌, 학생 개인의 생기부·내신·관심 분야를 데이터로 정밀 분석합니다. 메가스터디 러셀에서 쌓아온 최상위권 입시 노하우를 바탕으로, 막연한 진학 고민을 합격으로 이어지는 명확한 실행 로드맵으로 바꾸어 드리는 윤앤고만의 컨설팅 방식입니다.</p>
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
