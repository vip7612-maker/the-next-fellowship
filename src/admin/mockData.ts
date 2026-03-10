export interface Applicant {
    id: number;
    name: string;
    school: string;
    phone: string;
    email: string;
    careerReason: string;
    motivation: string;
    questionForYoon: string;
    status: 'Pending' | 'Selected' | 'Waitlist';
    date: string;
}

const initialMockApplicants: Applicant[] = [
    {
        id: 1,
        name: "김민수",
        school: "홍천고등학교",
        phone: "010-1234-5678",
        email: "minsu@email.com",
        careerReason: "반도체 설계 엔지니어 - 전자기기 원리에 관심이 많고 시스템반도체가 미래라고 생각합니다.",
        motivation: "현직 전문가님의 조언을 듣고 진로 계획을 구체화하고 싶습니다.",
        questionForYoon: "이과 최상위권의 생기부는 어떤 차별점이 있는지 궁금합니다.",
        status: 'Pending',
        date: "2026-03-01"
    },
    {
        id: 2,
        name: "이서연",
        school: "홍천여자고등학교",
        phone: "010-2345-6789",
        email: "seoyeon@email.com",
        careerReason: "콘텐츠 마케터 - 사람들의 마음을 움직이는 콘텐츠의 힘에 매료되었습니다.",
        motivation: "마케팅 전문가님의 강연을 통해 실제 실무 역량을 배우고 싶습니다.",
        questionForYoon: "문과생으로서 차별화된 스토리텔링을 어떻게 어필할 수 있을까요?",
        status: 'Selected',
        date: "2026-03-02"
    },
    {
        id: 3,
        name: "박준영",
        school: "양덕중고등학교",
        phone: "010-3456-7890",
        email: "junyoung@email.com",
        careerReason: "물리학 연구원 - 반도체 소자의 근원적인 특성에 관심이 큽니다.",
        motivation: "단순 지식을 넘어 산업 현장의 실제 분위기와 어려움을 알고 싶습니다.",
        questionForYoon: "순수 학문(물리)과 공학(응용) 사이에서 생기부 방향을 어떻게 잡을까요?",
        status: 'Waitlist',
        date: "2026-03-03"
    },
    {
        id: 4,
        name: "최지우",
        school: "홍천여자고등학교",
        phone: "010-4567-8901",
        email: "jiwoo@email.com",
        careerReason: "영업/서비스 기획자 - 사람들과 소통하고 가치를 전달하는 데 보람을 느낍니다.",
        motivation: "새로운 분야의 사람들을 만나 시야를 넓히고 싶습니다.",
        questionForYoon: "지원하려는 학과가 모호할 때, 무엇을 기준으로 대학을 선택해야 할까요?",
        status: 'Pending',
        date: "2026-03-04"
    }
];

export const getApplicants = (): Applicant[] => {
    const saved = localStorage.getItem('fellowship_applicants');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse applicants from local storage", e);
        }
    }
    return initialMockApplicants;
};

export const saveApplicants = (applicants: Applicant[]) => {
    localStorage.setItem('fellowship_applicants', JSON.stringify(applicants));
};

export const addApplicant = (applicantData: Omit<Applicant, 'id' | 'status' | 'date'>) => {
    const currentApplicants = getApplicants();
    const newApplicant: Applicant = {
        ...applicantData,
        id: Date.now(),
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    };
    saveApplicants([newApplicant, ...currentApplicants]);
};

export const updateApplicantStatus = (id: number | string, status: Applicant['status']) => {
    const applicants = getApplicants();
    const updated = applicants.map(app => app.id === Number(id) ? { ...app, status } : app);
    saveApplicants(updated);
};

export interface Topic {
    id: number;
    title: string;
    description: string;
    votes: number;
    createdAt: string;
    authorName: string;
    authorPhone: string;
}

export interface VoteRecord {
    id: number;
    topicId: number;
    name: string;
    phone: string;
    createdAt: string;
}

const initialTopics: Topic[] = [
    { id: 1, title: "경제,금융", description: "자본주의의 흐름을 읽고 새로운 가치를 창출하는 경제와 금융의 세계.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 2, title: "자유전공학부", description: "나만의 길을 스스로 설계하는 융합 인재의 시대를 대비합니다.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 3, title: "교육계열", description: "누군가의 인생과 미래를 빚어내는 가장 가치 있는 일, 교육의 진정한 의미.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 4, title: "AI분야", description: "우리의 일상을 혁신하고 세상을 바꾸는 인공지능 기술의 오늘과 내일.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 5, title: "생명화학", description: "인류가 직면한 난제를 해결하는 생명과학과 화학의 무한한 가능성.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 6, title: "건축", description: "사람의 시간과 공간을 잇고 새로운 뼈대를 세우는 건축의 본질.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 7, title: "예체능(음악,미술,체육)", description: "한계를 극복하는 열정과 창의성으로 세상에 감동을 전합니다.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 8, title: "보건(간호)", description: "생명의 가장 가까이에서 돌봄과 헌신의 가치를 실천하는 의료 복지.", votes: 0, createdAt: "2026-03-09", authorName: "운영진", authorPhone: "000-0000-0000" }
];

export const getTopics = (): Topic[] => {
    let topics = initialTopics;
    const saved = localStorage.getItem('fellowship_topics');
    if (saved) {
        try {
            topics = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse topics", e);
        }
    }

    // Recalculate true votes based on actual vote records to ensure data integrity
    const allVotes = getTopicVotes();
    return topics.map(topic => ({
        ...topic,
        votes: allVotes.filter(v => v.topicId === topic.id).length
    }));
};

export const saveTopics = (topics: Topic[]) => {
    localStorage.setItem('fellowship_topics', JSON.stringify(topics));
};

export const addTopic = (topicData: { title: string; description: string; authorName: string; authorPhone: string }) => {
    const currentTopics = getTopics();
    const newTopic: Topic = {
        ...topicData,
        id: Date.now(),
        votes: 1, // Author's vote counts as 1 automatically
        createdAt: new Date().toISOString()
    };
    saveTopics([newTopic, ...currentTopics]);

    // Automatically record the author's vote to prevent double voting on their own topic
    addTopicVote(newTopic.id, topicData.authorName, topicData.authorPhone);
};

export const getTopicVotes = (): VoteRecord[] => {
    const saved = localStorage.getItem('fellowship_topic_votes');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) { }
    }
    return [];
};

export const saveTopicVotes = (votes: VoteRecord[]) => {
    localStorage.setItem('fellowship_topic_votes', JSON.stringify(votes));
};

export const addTopicVote = (topicId: number, name: string, phone: string) => {
    const currentVotes = getTopicVotes();

    // Duplication Check: Same name and phone for the same topic
    const hasVoted = currentVotes.some(v => v.topicId === topicId && v.name === name && v.phone === phone);
    if (hasVoted) {
        throw new Error("이미 이 주제에 신청(투표)하셨습니다.");
    }

    const newVote: VoteRecord = {
        id: Date.now(),
        topicId,
        name,
        phone,
        createdAt: new Date().toISOString()
    };
    saveTopicVotes([newVote, ...currentVotes]);

    // Update the vote count in the Topic object
    const currentTopics = getTopics();
    const updatedTopics = currentTopics.map(t =>
        t.id === topicId ? { ...t, votes: t.votes + 1 } : t
    );
    saveTopics(updatedTopics);
};

export const mockGallery = [
    { id: 1, title: "오리엔테이션 스케치", type: "이미지", date: "2026-03-01", status: "게시됨" },
    { id: 2, title: "반도체 vs 마케팅 하이라이트", type: "유튜브", date: "2026-03-22", status: "게시됨" },
    { id: 3, title: "참여자 네트워킹 데이", type: "이미지", date: "2026-03-25", status: "비공개" }
];

export const getTargetCapacity = (): number => {
    const saved = localStorage.getItem('fellowship_target_capacity');
    if (saved) {
        return parseInt(saved, 10) || 50;
    }
    return 50;
};

export const saveTargetCapacity = (capacity: number) => {
    localStorage.setItem('fellowship_target_capacity', capacity.toString());
};

