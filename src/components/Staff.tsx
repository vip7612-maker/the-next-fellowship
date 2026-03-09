import { useEffect } from 'react';
import Navbar from './Navbar';
import './Staff.css';

const staffMembers = [
    {
        id: 1,
        name: '김인순 이사장',
        role: '가수 인순이 / 해밀학교 설립자',
        bio: '해밀학교 설립자이자 이사장으로서 다음 세대를 이끌어갈 청년들에게 영감과 방향을 제시합니다.',
        image: '/staff/1.jpg'
    },
    {
        id: 2,
        name: '박세인',
        role: 'Stanford University \'16, Science, Technology & Society',
        bio: '現) 폴앤마크 Global Business Director & 4MAT Trainer\n現) 리더십 웰니스 코치 (NBC-HWC)\n現) 브랜드 전략 컨설턴트 & 어드바이저\n現) 온체어 by SIDIZ 팟캐스트 호스트',
        image: '/staff/2.jpg'
    },
    {
        id: 3,
        name: '이경진',
        role: '사단법인 인순이와 좋은 사람들 사무국장',
        bio: '현) 사단법인 인순이와 좋은 사람들 사무국장\n전) 해밀학교 교장',
        image: '/staff/3.jpg'
    },
];

const studentBoard = [
    {
        id: 4,
        name: '원정민',
        role: '학생 보드 총괄 / 홍천고등학교 제 52대 학생회장',
        bio: '안녕하십니까? The next fellowship 프로젝트의 학생 보드멤버에서 총괄을 맡고 있는 홍천고등학교 제 52대 학생회장 원정민 입니다.',
        image: '/staff/4.jpg'
    },
    {
        id: 5,
        name: '김경란',
        role: '학생 보드 홍보 / 홍천여자고등학교 2학년',
        bio: '안녕하세요! The next fellowship 프로젝트의 학생 보드 멤버 중 홍보를 담당하고 있는 홍천여자고등학교 2학년 김경란입니다.',
        image: '/staff/5.jpg'
    },
    {
        id: 6,
        name: '목진교',
        role: '학생 보드 기획 / 홍천고등학교',
        bio: '안녕하십니까. The Next Fellowship에서 학생 보드 멤버 중 기획을 맡은 홍천고등학교 목진교 입니다.',
        image: '/staff/6.jpg'
    },
    {
        id: 7,
        name: '김서연',
        role: '학생 보드 편집 / 홍천여자고등학교 2학년',
        bio: '안녕하세요 The next fellowship 프로젝트의 학생 보드 멤버 중 편집을 담당하고 있는 홍천여자고등학교 2학년 김서연입니다.',
        image: '/staff/7.jpg'
    }
];

const Staff = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="staff-page">
            <Navbar />
            <main className="staff-main">
                <div className="container">
                    <div className="staff-header">
                        <div className="intro-badge neon-text" style={{ marginBottom: '20px' }}>Our Team</div>
                        <h1 className="staff-title">프로젝트 <span className="neon-text">운영팀</span></h1>
                        <p className="staff-subtitle">The Next Fellowship을 함께 기획하고 만들어가는 사람들을 소개합니다.</p>
                    </div>

                    <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '40px', textAlign: 'center' }}>Advisory & Operational Board</h2>
                    <div className="staff-grid">
                        {staffMembers.map(member => (
                            <div className="staff-card" key={member.id}>
                                <div className="staff-image-container">
                                    <img src={member.image} alt={member.name} className="staff-image" />
                                </div>
                                <div className="staff-info">
                                    <span className="staff-role">{member.role}</span>
                                    <h3 className="staff-name">{member.name}</h3>
                                    <p className="staff-bio" style={{ whiteSpace: 'pre-line' }}>{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="section-title" style={{ fontSize: '2rem', marginTop: '100px', marginBottom: '40px', color: '#ff007f', textAlign: 'center' }}>Student Board</h2>
                    <div className="staff-grid">
                        {studentBoard.map(member => (
                            <div className="staff-card" key={member.id}>
                                <div className="staff-image-container">
                                    <img src={member.image} alt={member.name} className="staff-image" />
                                </div>
                                <div className="staff-info">
                                    <span className="staff-role" style={{ color: '#ff007f' }}>{member.role}</span>
                                    <h3 className="staff-name">{member.name}</h3>
                                    <p className="staff-bio" style={{ whiteSpace: 'pre-line' }}>{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer>
                <div className="container footer-content">
                    <div className="footer-logo">
                        THE <span className="neon-text">NEXT</span> FELLOWSHIP
                    </div>
                    <div className="footer-right">
                        <p>© 2026 인순이와 좋은 사람들. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Staff;
