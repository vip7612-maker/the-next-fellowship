import './About.css';

const About = () => {
    return (
        <div className="about-content" style={{ marginTop: '40px', marginBottom: '40px' }}>
            <h2 className="about-title">
                우리가 <span className="neon-text">넥스트 펠로우십</span>을 시작한 이유
            </h2>

            <div className="about-manifesto">
                <p className="manifesto-lead">
                    "지방이라는 한계를 넘어, 당신의 잠재력을 무한대로"
                </p>

                <div className="manifesto-body">
                    <p>
                        우리는 꿈의 크기가 지역에 의해 제한되어서는 안 된다고 믿습니다. 하지만 현실은 정보의 격차, 네트워킹의 부재, 그리고 막연한 두려움이 우리 아이들의 발목을 잡고 있습니다.
                    </p>
                    <p>
                        <span className="highlight-text">The Next Fellowship</span>은 이 간극을 메우기 위해 탄생했습니다. 단순한 특강을 넘어, 현재 산업의 최전선에서 뛰고 있는 <strong>최고의 전문가들과의 만남</strong>을 제공합니다.
                    </p>
                    <p>
                        이 만남은 막연했던 꿈을 선명한 비전으로 바꾸고, <strong>대학생 멘토들</strong>과의 교류를 통해 그 비전을 향한 구체적인 로드맵을 설계하게 합니다. 그리고 마침내, <strong>전문 진학 컨설팅</strong>을 통해 그 로드맵을 하나씩 실현해 나갈 수 있도록 든든한 조력자가 될 것입니다.
                    </p>
                    <p className="manifesto-conclusion">
                        우리는 당신의 다음(NEXT)을 응원합니다. <br />
                        <strong>우물 밖의 더 넓은 세상으로 나아갈 준비가 되셨습니까?</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
