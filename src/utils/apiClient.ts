// API Client - Turso DB와 통신하는 유틸리티
// Vercel 서버리스 함수를 통해 데이터베이스에 접근합니다.

// Vite proxy가 /api 요청을 Vercel 서버로 프록시합니다.
const API_BASE = '/api';

export interface Applicant {
    id: number | string;
    name: string;
    school: string;
    phone: string;
    email: string;
    careerReason: string;
    motivation: string;
    questionForYoon: string;
    status: 'Pending' | 'Selected' | 'Waitlist' | 'Deleted';
    date: string;
    role: string;
    deletedAt?: string;
}

export interface Topic {
    id: number | string;
    title: string;
    description: string;
    votes: number;
    createdAt: string;
    authorName: string;
    authorPhone: string;
}

export interface VoteRecord {
    id: number | string;
    topicId: number | string;
    name: string;
    phone: string;
    createdAt: string;
}

export interface Survey {
    id: string;
    name: string;
    phone: string;
    satisfaction: number;
    helpfulness: number;
    feedback: string;
    constructiveOpinion: string;
    createdAt: string;
}

// ===== Applicants =====

export const fetchApplicants = async (): Promise<Applicant[]> => {
    const res = await fetch(`${API_BASE}/applicants?t=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error('신청자 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitApplicant = async (data: Omit<Applicant, 'id' | 'status' | 'date' | 'deletedAt'>): Promise<void> => {
    const body = {
        id: String(Date.now()),
        ...data,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
    };
    const res = await fetch(`${API_BASE}/applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '신청 처리 중 오류가 발생했습니다.');
    }
};

export const updateApplicantStatus = async (id: number | string, status: Applicant['status']): Promise<void> => {
    const res = await fetch(`${API_BASE}/applicants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: String(id), status })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '상태 업데이트에 실패했습니다.');
    }
};

// ===== Topics =====

export const fetchTopics = async (): Promise<Topic[]> => {
    const res = await fetch(`${API_BASE}/topics?t=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error('주제 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitTopic = async (data: { title: string; description: string; authorName: string; authorPhone: string }): Promise<void> => {
    const id = String(Date.now());
    const body = {
        id,
        ...data,
        votes: 1,
        createdAt: new Date().toISOString().split('T')[0]
    };
    const res = await fetch(`${API_BASE}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '주제 제안에 실패했습니다.');
    }
    // 작성자를 자동으로 첫 투표자로 등록
    await submitVote(id, data.authorName, data.authorPhone);
};

// ===== Votes =====

export const fetchVotes = async (topicId?: number | string): Promise<VoteRecord[]> => {
    const url = topicId ? `${API_BASE}/votes?topicId=${topicId}&t=${Date.now()}` : `${API_BASE}/votes?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error('투표 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitVote = async (topicId: number | string, name: string, phone: string): Promise<void> => {
    const body = {
        id: String(Date.now()),
        topicId: String(topicId),
        name,
        phone,
        createdAt: new Date().toISOString()
    };
    const res = await fetch(`${API_BASE}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '투표 처리에 실패했습니다.');
    }
};

// ===== Target Capacity (localStorage 유지 - 관리자 설정) =====

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

// ===== SMS =====

export const sendSms = async (messages: { to: string, text: string }[]): Promise<any> => {
    const res = await fetch(`${API_BASE}/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '문자 발송에 실패했습니다.');
    }
    return res.json();
};

// ===== Surveys =====

export const fetchSurveys = async (): Promise<Survey[]> => {
    const res = await fetch(`${API_BASE}/surveys?t=${Date.now()}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error('설문 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitSurvey = async (data: Omit<Survey, 'id' | 'createdAt'>): Promise<void> => {
    const body = {
        id: String(Date.now()),
        ...data,
        createdAt: new Date().toISOString()
    };
    const res = await fetch(`${API_BASE}/surveys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '설문 제출에 실패했습니다.');
    }
};
