export interface Applicant {
    id: number;
    name: string;
    school: string;
    phone: string;
    email: string;
    major: string;
    reason: string;
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
        major: "반도체 공학",
        reason: "저는 어릴 때부터 전자기기의 원리에 관심이 많았습니다. 특히 반도체가 현대 문명의 쌀이라고 불리는 점에 깊은 인상을 받았고, 이번 펠로우십을 통해 현직 전문가님의 조언을 듣고 제 꿈을 구체화하고 싶습니다.",
        status: 'Pending',
        date: "2026-03-01"
    },
    {
        id: 2,
        name: "이서연",
        school: "홍천여자고등학교",
        phone: "010-2345-6789",
        email: "seoyeon@email.com",
        major: "콘텐츠 마케팅",
        reason: "유튜브와 틱톡 같은 뉴미디어 시대에 사람들의 마음을 움직이는 콘텐츠의 힘에 매료되었습니다. 마케팅 전문가님의 강연을 통해 실제 실무에서는 어떤 역량이 필요한지 직접 배우고 싶어 지원하게 되었습니다.",
        status: 'Selected',
        date: "2026-03-02"
    },
    {
        id: 3,
        name: "박준영",
        school: "양덕중고등학교",
        phone: "010-3456-7890",
        email: "junyoung@email.com",
        major: "반도체 공학",
        reason: "물리학 동아리 활동을 하며 반도체 소자의 특성에 대해 공부했습니다. 단순한 지식을 넘어 실제 산업 현장에서는 어떤 어려움이 있고 어떤 보람을 느끼시는지 알고 싶습니다.",
        status: 'Waitlist',
        date: "2026-03-03"
    },
    {
        id: 4,
        name: "최지우",
        school: "홍천여자고등학교",
        phone: "010-4567-8901",
        email: "jiwoo@email.com",
        major: "콘텐츠 마케팅",
        reason: "저는 학교 신문사에서 활동하며 기획의 중요성을 깨달았습니다. 사람들에게 긍정적인 영향력을 미치는 마케터가 되고 싶습니다.",
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
    { id: 1, title: "반도체 공학", description: "현대 기술의 핵심인 반도체에 대해 더 깊이 알아보고 싶습니다.", votes: 0, createdAt: "2026-03-01", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 2, title: "콘텐츠 마케팅", description: "사람들의 마음을 움직이는 콘텐츠 기획의 비밀을 파헤칩니다.", votes: 0, createdAt: "2026-03-02", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 3, title: "투자 뱅킹 (IB)", description: "금융 시장의 꽃, IB의 세계와 커리어 패스.", votes: 0, createdAt: "2026-03-03", authorName: "운영진", authorPhone: "000-0000-0000" },
    { id: 4, title: "의료/생명과학", description: "인류의 건강을 책임지는 생명과학 기술의 미래.", votes: 0, createdAt: "2026-03-04", authorName: "운영진", authorPhone: "000-0000-0000" }
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

