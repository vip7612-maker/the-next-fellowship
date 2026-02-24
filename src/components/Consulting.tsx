import './Consulting.css';

const Consulting = () => {
    return (
        <section className="consulting" id="consulting">
            <div className="container">
                <div className="consulting-content">
                    <h2 className="section-title">윤앤고가 제안하는<br /><span className="blue-text">데이터 기반</span> 진학 나침반</h2>
                    <p className="section-desc">
                        단순한 상담이 아닙니다. 개인별 생기부 분석부터 꿈을 구체화하는 전략까지,
                        믿을 수 있는 전문가 그룹이 소수 정예 밀착 컨설팅을 제공합니다.
                    </p>

                    <div className="process-grid">
                        <div className="process-step">
                            <div className="step-num">01</div>
                            <h4>데이터 분석</h4>
                            <p>생활기록부 및 활동 내역 정밀 진단</p>
                        </div>
                        <div className="process-step">
                            <div className="step-num">02</div>
                            <h4>전략 수립</h4>
                            <p>관심 전공과 연계한 나만의 스토리 기획</p>
                        </div>
                        <div className="process-step">
                            <div className="step-num">03</div>
                            <h4>실전 코칭</h4>
                            <p>구체적인 실행 방안 및 로드맵 제시</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Consulting;
