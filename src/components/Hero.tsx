import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-svg-bg">
                <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: 'var(--color-neon-lime)', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: 'var(--color-electric-blue)', stopOpacity: 0.2 }} />
                        </linearGradient>
                    </defs>
                    <path className="morph-path" d="M800,500Q800,700,600,700Q400,700,400,500Q400,300,600,300Q800,300,800,500Z" fill="url(#grad1)">
                        <animate
                            attributeName="d"
                            dur="10s"
                            repeatCount="indefinite"
                            values="
                M800,500Q800,700,600,700Q400,700,400,500Q400,300,600,300Q800,300,800,500Z;
                M850,550Q750,800,550,750Q300,700,350,450Q400,200,650,250Q900,300,850,550Z;
                M750,600Q700,850,450,800Q200,750,250,500Q300,250,550,300Q800,350,750,600Z;
                M800,500Q800,700,600,700Q400,700,400,500Q400,300,600,300Q800,300,800,500Z
              "
                        />
                    </path>
                </svg>
            </div>
            <div className="container hero-content">
                <h1 className="hero-title reveal active">
                    정답은 하나가 <br className="desktop-only-br" />아니니까,<br />
                    너만의 <span className="neon-text">다음을</span> 그려봐.
                </h1>
                <p className="hero-subtitle reveal active">
                    어디에 있든, 더 넓은 기회와 연결될 수 있도록,<br />
                    입시와 전공 선택부터 커리어·삶의 방향까지 스스로 설계하는 힘을 기르는 우리들만의 커리어 포럼.<br /><br />
                    <span className="blue-text">'더 넥스트 펠로우십'</span>에서 진짜 나를 발견해보세요.
                </p>
                <div className="hero-btns reveal active">
                    <a href="#application" className="cta-button-main" style={{ display: 'inline-block', textDecoration: 'none' }}>신청하기</a>
                    {/* 지난 회차 보기 숨김 처리 
                    <a href="#history" className="secondary-button" style={{ display: 'inline-block', textDecoration: 'none' }}>지난 회차 보기</a> 
                    */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
