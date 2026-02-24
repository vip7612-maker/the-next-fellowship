import './Application.css';

const Application = () => {
    return (
        <section className="application" id="application">
            <div className="container">
                <div className="application-box">
                    <div className="application-info">
                        <h2 className="section-title">속도보다는 방향,<br />우리의 기준은 <span className="neon-text">당신의 진심</span>입니다</h2>
                        <p>선착순이 아닙니다. 학생 보드 멤버들이 당신의 고민과 신청 이유를 신중히 읽고 함께할 동료를 선발합니다.</p>
                        <ul className="criteria-list">
                            <li>신청 기간: ~ 3월 15일 23:59까지</li>
                            <li>선발 인원: 강원도 지역 고등학생 00명</li>
                            <li>발표: 3월 17일 개별 연락</li>
                        </ul>
                    </div>

                    <div className="application-form-preview">
                        <div className="form-field">
                            <label>꿈꾸는 전공이나 학과가 있나요?</label>
                            <input type="text" placeholder="예: 인공지능, 영상 미디어..." disabled />
                        </div>
                        <div className="form-field">
                            <label>펠로우십에 합류하고 싶은 진짜 이유는?</label>
                            <textarea placeholder="당신만의 이야기를 들려주세요 (최소 100자)" disabled></textarea>
                        </div>
                        <button className="cta-button-main full-width">지금 지원서 작성하기</button>
                        <p className="waitlist-info">현재 14명의 대기자가 있습니다 (신청률 140%)</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Application;
