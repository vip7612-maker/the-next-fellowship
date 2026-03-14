import { useEffect } from 'react';
import Navbar from './Navbar';
import './Staff.css';

const staffMembers = [
    {
        id: 1,
        name: '김인순 이사장',
        role: '가수 인순이 / 해밀학교 설립자',
        bio: '現) 사단법인 인순이와 좋은 사람들 이사장\n現) 해밀학교 설립자 및 이사장\n\n안녕하세요, 사단법인 인순이와 좋은 사람들 이사장이자 가수 인순이(김인순)입니다. 해밀학교 설립자이자 이사장으로서 다음 세대를 이끌어갈 청소년들에게 영감과 방향을 제시하는 든든한 멘토가 되겠습니다.',
        image: '/staff/1.jpg'
    },
    {
        id: 2,
        name: '박세인',
        role: '브랜드 전략 컨설턴트 & 어드바이저',
        bio: '現) Stanford SCIDR Lab 웰니스 연구 컨설턴트\n現) 폴앤마크 Global Business Director & 4MAT Trainer\n\n안녕하세요, 더 넥스트 펠로우십의 총괄 기획을 맡고 있는 박세인 입니다. 웰니스·리더십·교육을 연결하며 더 건강한 리더의 성장을 탐구하는 스토리텔러이자 컨설턴트입니다.',
        image: '/staff/2.jpg'
    },
    {
        id: 3,
        name: '이경진',
        role: '사단법인 인순이와 좋은 사람들 사무국장',
        bio: '現) 사단법인 인순이와 좋은 사람들 사무국장\n前) 해밀학교 교장\n\n안녕하세요, 사단법인 인순이와 좋은 사람들 사무국장 이경진입니다. 다음세대 청소년들이 각자의 잠재력을 발견하고 더 나은 미래를 향해 나아갈 수 있도록 최선을 다해 지원하겠습니다.',
        image: '/staff/3.jpg'
    },
];

const studentBoard = [
    {
        id: 4,
        name: '원정민',
        role: '학생 보드 총괄 / 홍천고등학교 제 52대 학생회장',
        bio: '저는 The Next Fellowship의 학생 보드멤버로서 학생들이 다양한 분야의 전문가분들을 만나고 진로에 대해 생각해 볼 수 있는 기회를 만드는 데 기여하고 싶습니다. 또한 훌륭한 리더가 되는 방법에 대한 관심을 바탕으로 다양한 경험을 배우며 더 많은 학생들이 자신의 관심 분야를 발견할 수 있도록 돕는 것이 저의 목표입니다.',
        image: '/staff/4.jpg'
    },
    {
        id: 5,
        name: '김경란',
        role: '학생 보드 홍보 / 홍천여자고등학교 2학년',
        bio: '진로는 누군가가 정해 주는 하나의 선택지가 아닌 여러 가능성을 직접 마주하고 고민하는 과정 속에서 점차 또렷해진다고 생각합니다. 저는 The Next Fellowship의 학생 보드 멤버로서 학생들이 각 분야의 전문가들과 대화를 나누고, 서로의 생각을 공유하며 자신의 관심과 가치관을 탐색할 수 있는 환경을 만드는데 기여하고 싶습니다.',
        image: '/staff/5.jpg'
    },
    {
        id: 6,
        name: '목진교',
        role: '학생 보드 기획 / 홍천고등학교',
        bio: 'The Next Fellowship에서 기획 운영을 담당하고 있는 보드멤버 목진교입니다. 저는 모든 기술의 연결고리가 되는 전자공학 관심을 가지고 있으며, 이러한 공학적 사고를 바탕으로 학생들에게 영감을 줄 수 있는 다채로운 만남을 설계하려고 노력하고 있습니다. 전문가들의 도움이 학생들의 미래에 도움될 수 있도록 가교 역할을 수행하며, The Next Fellowship을 통해 모든 학생이 각자의 전공과 꿈을 구체화할 수 있는 기회의 토양을 만드는 것이 저의 바람입니다.',
        image: '/staff/6.jpg'
    },
    {
        id: 7,
        name: '김서연',
        role: '학생 보드 편집 / 홍천여자고등학교 2학년',
        bio: '저는 The Next Fellowship의 학생 보드멤버로서 마케팅팀에서 콘텐츠 편집을 담당하고 있습니다. 저는 현재 생명화학 분야에 관심을 가지고 있으며 다양한 전문가들의 이야기가 학생들에게 의미 있게 전달될 수 있도록 돕고 싶습니다. 더 넥스트 펠로우십을 통해 더 많은 학생들이 여러 분야를 접하고 자신의 진로와 관심을 발견할 수 있는 기회를 만드는 것이 저의 비전입니다.',
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
