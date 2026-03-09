import About from './About';
import './Intro.css';

const Intro = () => {
    return (
        <section className="intro" id="intro">
            <div className="container">
                <div className="intro-badge neon-text">PROGRAM PHILOSOPHY</div>

                <div className="limit-breaker-box">
                    <h2 className="limit-title">
                        <span className="dimmed-text">지방이라서? 고등학생이라서?</span><br />
                        그런 한계는 <span className="blue-text">우리가 깰게요.</span>
                    </h2>
                </div>

                <About />

            </div>
        </section>
    );
};

export default Intro;
