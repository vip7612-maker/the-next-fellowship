import './Gallery.css';

const Gallery = () => {
    return (
        <section className="gallery" id="gallery">
            <div className="container">
                <h2 className="section-title">기록, 그리고 <span className="blue-text">성장</span></h2>

                <div className="gallery-grid">
                    <div className="gallery-item large">
                        <div className="placeholder-img">1회차 메인 강연 하이라이트 영상</div>
                    </div>
                    <div className="gallery-item">
                        <div className="placeholder-img">멘토링 세션 현장 스케치 01</div>
                    </div>
                    <div className="gallery-item">
                        <div className="placeholder-img">참가 학생 인터뷰</div>
                    </div>
                    <div className="gallery-item">
                        <div className="placeholder-img">입시 컨설팅 현장</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
