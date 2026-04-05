import './Consulting.css';

const Consulting = () => {
    return (
        <section className="consulting" id="consulting">
            <div className="container">
                {/* Badge */}
                <div className="consulting-badge">
                    <span className="badge-icon">💡</span>
                    <span>MINI CONSULTING</span>
                </div>

                {/* 메인 타이틀 */}
                <h2 className="consulting-title">
                    내가 원하는 학교와 학과에<br className="mobile-only-br" /> 진학하기 위해<br className="desktop-only-br" />
                    <span className="consulting-highlight">지금 당장 필요한 것</span>이 무엇인지<br className="mobile-only-br" /> 알고 계신가요?
                </h2>

                {/* 서브 설명 */}
                <p className="consulting-desc">
                    윤앤고 입시전략팀이 <strong>체계적이고 현실적인 맞춤형 진학 컨설팅</strong>을 제공합니다.<br />
                    직접 대면해서 궁금증을 해소할 수 있는 <span className="consulting-accent">미니 컨설팅</span>으로,<br className="desktop-only-br" />
                    막연한 불안 대신 <strong>확실한 방향</strong>을 잡아드립니다.
                </p>

                {/* 프로세스 카드들 */}
                <div className="consulting-grid">
                    <div className="consulting-card">
                        <div className="card-glow"></div>
                        <div className="card-number">01</div>
                        <div className="card-icon">📊</div>
                        <h4>현재 상태 진단</h4>
                        <p>
                            생활기록부·내신·비교과 활동을 종합 분석하여<br />
                            현재 나의 위치를 객관적으로 파악합니다.
                        </p>
                    </div>
                    <div className="consulting-card">
                        <div className="card-glow"></div>
                        <div className="card-number">02</div>
                        <div className="card-icon">🎯</div>
                        <h4>맞춤 전략 수립</h4>
                        <p>
                            희망 학교·학과와 연계하여<br />
                            합격 가능성을 높이는 나만의 로드맵을 설계합니다.
                        </p>
                    </div>
                    <div className="consulting-card">
                        <div className="card-glow"></div>
                        <div className="card-number">03</div>
                        <div className="card-icon">🤝</div>
                        <h4>1:1 대면 상담</h4>
                        <p>
                            전문 컨설턴트와 직접 만나<br />
                            궁금한 점을 해소하고 실천 방안을 확정합니다.
                        </p>
                    </div>
                </div>

                {/* 부가 메시지 */}
                <div className="consulting-features">
                    <div className="feature-item">
                        <span className="feature-check">✓</span>
                        <span>소수 정예 밀착 상담</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-check">✓</span>
                        <span>현직 입시 전문가 직접 참여</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-check">✓</span>
                        <span>실전 데이터 기반 분석</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="consulting-cta">
                    <a href="#application" className="consulting-cta-btn">
                        미니 컨설팅 신청하기
                        <span className="cta-arrow">→</span>
                    </a>
                    <p className="cta-sub">참가 신청 시 미니 컨설팅이 함께 제공됩니다.</p>
                </div>
            </div>
        </section>
    );
};

export default Consulting;
