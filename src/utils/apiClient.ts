const API_BASE = '/api';

const ADMIN_TOKEN_KEY = 'fellowship_admin_token';

export const getAdminToken = (): string | null =>
    sessionStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token: string) =>
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);

export const clearAdminToken = () =>
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);

const adminHeaders = (): Record<string, string> => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const res = await fetch(input, init);
    if (res.status === 401) {
        clearAdminToken();
        window.location.reload();
    }
    return res;
};

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
    round: number;
    deletedAt?: string;
    transcriptFileName?: string | null;
    transcriptMimeType?: string | null;
    transcriptUrl?: string | null;
    transcriptSizeBytes?: number | null;
}

export interface ApplicantSubmit {
    name: string;
    school?: string;
    phone: string;
    email?: string;
    role: string;
    round?: number;
    careerReason: string;
    motivation: string;
    questionForYoon: string;
    transcriptFileName?: string;
    transcriptMimeType?: string;
    transcriptUrl?: string;
    transcriptSizeBytes?: number;
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
    const res = await apiFetch(`${API_BASE}/applicants?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('신청자 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const fetchApplicantTranscript = async (id: string | number): Promise<{
    id: string;
    name: string;
    transcriptFileName: string;
    transcriptMimeType: string;
    transcriptUrl?: string | null;
    transcriptDataUrl?: string | null;
    transcriptSizeBytes: number | null;
}> => {
    const res = await apiFetch(`${API_BASE}/applicants?id=${encodeURIComponent(String(id))}&attachment=transcript&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '첨부 파일을 불러올 수 없습니다.');
    }
    return res.json();
};

export const uploadTranscript = async (file: File, onProgress?: (pct: number) => void): Promise<{ url: string }> => {
    const { upload } = await import('@vercel/blob/client');
    const safeName = file.name.replace(/[^\w가-힣.\-]+/g, '_');
    const blob = await upload(`transcripts/${Date.now()}-${safeName}`, file, {
        access: 'public',
        handleUploadUrl: `${API_BASE}/blob-upload`,
        contentType: file.type,
        onUploadProgress: onProgress ? (e) => onProgress(e.percentage) : undefined,
    });
    return { url: blob.url };
};

export const submitApplicant = async (data: ApplicantSubmit): Promise<void> => {
    const res = await fetch(`${API_BASE}/applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '신청 처리 중 오류가 발생했습니다.');
    }
};

export const updateApplicantStatus = async (id: number | string, status: Applicant['status']): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/applicants`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
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
    const res = await fetch(`${API_BASE}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '주제 제안에 실패했습니다.');
    }
};

// ===== Votes =====

export const fetchVotes = async (topicId?: number | string): Promise<VoteRecord[]> => {
    const url = topicId ? `${API_BASE}/votes?topicId=${topicId}&t=${Date.now()}` : `${API_BASE}/votes?t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error('투표 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitVote = async (topicId: number | string, name: string, phone: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: String(topicId), name, phone })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '투표 처리에 실패했습니다.');
    }
};

// ===== Target Capacity =====

export const getTargetCapacity = (): number => {
    const saved = localStorage.getItem('fellowship_target_capacity');
    return saved ? parseInt(saved, 10) || 50 : 50;
};

export const saveTargetCapacity = (capacity: number) => {
    localStorage.setItem('fellowship_target_capacity', capacity.toString());
};

// ===== SMS =====

export interface SmsTemplate {
    id: string;
    title: string;
    content: string;
    category: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SmsSendLog {
    id: string;
    groupId: string | null;
    templateId: string | null;
    title: string | null;
    content: string;
    targetType: string;
    targetCount: number;
    successCount: number;
    failCount: number;
    isLms: number;
    sentAt: string;
    rawResult: string | null;
}

export interface SmsSendRecipient {
    id: string;
    sendLogId: string;
    name: string | null;
    phone: string;
    status: 'success' | 'failed' | null;
    errorMessage: string | null;
}

export interface SmsSendMeta {
    templateId?: string;
    title?: string;
    targetType?: string;
    content?: string;
}

export const sendSms = async (
    messages: { to: string; text: string; name?: string }[],
    meta?: SmsSendMeta
): Promise<{ success: boolean; count: number; successCount: number; failCount: number; groupId?: string; logId?: string }> => {
    const res = await apiFetch(`${API_BASE}/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({ messages, meta })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '문자 발송에 실패했습니다.');
    }
    return res.json();
};

export const fetchSmsTemplates = async (): Promise<SmsTemplate[]> => {
    const res = await apiFetch(`${API_BASE}/smsAdmin?type=templates&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('템플릿 목록을 불러올 수 없습니다.');
    return res.json();
};

export const createSmsTemplate = async (data: { title: string; content: string; category?: string }): Promise<{ id: string }> => {
    const res = await apiFetch(`${API_BASE}/smsAdmin?type=template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '템플릿 생성에 실패했습니다.');
    }
    return res.json();
};

export const updateSmsTemplate = async (id: string, patch: { title?: string; content?: string; category?: string }): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/smsAdmin?type=template`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({ id, ...patch })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '템플릿 수정에 실패했습니다.');
    }
};

export const deleteSmsTemplate = async (id: string): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/smsAdmin?type=template&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...adminHeaders() }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '템플릿 삭제에 실패했습니다.');
    }
};

export const fetchSmsLogs = async (): Promise<SmsSendLog[]> => {
    const res = await apiFetch(`${API_BASE}/smsAdmin?type=logs&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('발송 이력을 불러올 수 없습니다.');
    return res.json();
};

export const fetchSmsLogDetail = async (id: string): Promise<SmsSendLog & { recipients: SmsSendRecipient[] }> => {
    const res = await apiFetch(`${API_BASE}/smsAdmin?type=log&id=${encodeURIComponent(id)}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('발송 상세를 불러올 수 없습니다.');
    return res.json();
};

// ===== Surveys =====

export const fetchSurveys = async (): Promise<Survey[]> => {
    const res = await apiFetch(`${API_BASE}/surveys?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('설문 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitSurvey = async (data: Omit<Survey, 'id' | 'createdAt'>): Promise<void> => {
    const res = await fetch(`${API_BASE}/surveys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '설문 제출에 실패했습니다.');
    }
};

// ===== Mentor Surveys (회차별 멘토 신청 설문) =====

export interface MentorSurvey {
    id: string;
    round: number;
    title: string;
    eventDate: string;
    location: string;
    capacity: string;
    description: string;
    isActive: number;
    createdAt: string;
}

export interface MentorSurveyResponse {
    id: string;
    surveyId: string;
    name: string;
    phone: string;
    email: string;
    university: string;
    grade: string;
    major: string;
    attendance: string;
    transport: string;
    motivation: string;
    shareStory: string;
    experience: string;
    consentPersonal: number;
    consentImage: number;
    createdAt: string;
}

export const fetchMentorSurveys = async (): Promise<MentorSurvey[]> => {
    const res = await apiFetch(`${API_BASE}/mentorSurveys?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('멘토 설문 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const fetchMentorSurvey = async (id: string): Promise<MentorSurvey> => {
    const res = await fetch(`${API_BASE}/mentorSurveys?id=${encodeURIComponent(id)}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '설문 정보를 불러올 수 없습니다.');
    }
    return res.json();
};

// ===== Gallery (관리자 업로드 → 슬롯별 이미지 사용) =====

export interface GalleryImage {
    id: string;
    slot: string | null;
    title: string;
    description: string;
    dataUrl: string;
    mimeType: string;
    sizeBytes: number | null;
    width: number | null;
    height: number | null;
    isActive: number;
    createdAt: string;
}

export interface GalleryListItem {
    id: string;
    slot: string | null;
    title: string;
    description: string;
    mimeType: string;
    sizeBytes: number | null;
    width: number | null;
    height: number | null;
    isActive: number;
    createdAt: string;
}

// 공개: 슬롯 키로 활성 이미지 1건 (없으면 null)
export const fetchGalleryBySlot = async (slot: string): Promise<GalleryImage | null> => {
    const res = await fetch(`${API_BASE}/gallery?slot=${encodeURIComponent(slot)}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.status === 204) return null;
    if (!res.ok) return null;
    return res.json();
};

// 공개: 슬롯 미지정 활성 이미지 목록 (포토앨범용)
export const fetchUnslottedGallery = async (): Promise<GalleryImage[]> => {
    const res = await fetch(`${API_BASE}/gallery?list=unslotted&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) return [];
    return res.json();
};

// 공개: 모든 슬롯 이미지 매핑
export const fetchGalleryPublicMap = async (): Promise<Record<string, GalleryImage>> => {
    const res = await fetch(`${API_BASE}/gallery?list=public&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) return {};
    return res.json();
};

export const fetchGalleryList = async (): Promise<GalleryListItem[]> => {
    const res = await apiFetch(`${API_BASE}/gallery?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('갤러리 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const fetchGalleryItem = async (id: string): Promise<GalleryImage> => {
    const res = await apiFetch(`${API_BASE}/gallery?id=${encodeURIComponent(id)}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '이미지를 불러올 수 없습니다.');
    }
    return res.json();
};

export const uploadGalleryImage = async (data: {
    slot?: string;
    title: string;
    description?: string;
    dataUrl: string;
    mimeType: string;
    sizeBytes?: number;
    width?: number;
    height?: number;
}): Promise<{ id: string }> => {
    const res = await apiFetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '이미지 업로드에 실패했습니다.');
    }
    return res.json();
};

export const updateGalleryImage = async (id: string, patch: { slot?: string | null; title?: string; description?: string; isActive?: boolean }): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/gallery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({ id, ...patch })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '이미지 수정에 실패했습니다.');
    }
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...adminHeaders() }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '이미지 삭제에 실패했습니다.');
    }
};

// 메인 페이지 배너용: 현재 활성화된 가장 최신 회차 설문 1건 (공개)
export const fetchLatestActiveMentorSurvey = async (): Promise<MentorSurvey | null> => {
    const res = await fetch(`${API_BASE}/mentorSurveys?latest=1&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.status === 204) return null;
    if (!res.ok) return null;
    return res.json();
};

export const createMentorSurvey = async (data: {
    round: number;
    title: string;
    eventDate?: string;
    location?: string;
    capacity?: string;
    description?: string;
}): Promise<{ id: string }> => {
    const res = await apiFetch(`${API_BASE}/mentorSurveys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '설문 생성에 실패했습니다.');
    }
    return res.json();
};

export interface MentorSurveyPatch {
    title?: string;
    eventDate?: string;
    location?: string;
    capacity?: string;
    description?: string;
    isActive?: boolean | number;
}

export const updateMentorSurvey = async (id: string, patch: MentorSurveyPatch): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/mentorSurveys`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...adminHeaders() },
        body: JSON.stringify({ id, ...patch })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '설문 수정에 실패했습니다.');
    }
};

export const deleteMentorSurvey = async (id: string): Promise<void> => {
    const res = await apiFetch(`${API_BASE}/mentorSurveys?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...adminHeaders() }
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '설문 삭제에 실패했습니다.');
    }
};

export const fetchMentorResponses = async (surveyId?: string): Promise<MentorSurveyResponse[]> => {
    const url = surveyId
        ? `${API_BASE}/mentorResponses?surveyId=${encodeURIComponent(surveyId)}&t=${Date.now()}`
        : `${API_BASE}/mentorResponses?t=${Date.now()}`;
    const res = await apiFetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', ...adminHeaders() }
    });
    if (!res.ok) throw new Error('멘토 응답 목록을 불러오는데 실패했습니다.');
    return res.json();
};

export const submitMentorResponse = async (data: Omit<MentorSurveyResponse, 'id' | 'createdAt'>): Promise<void> => {
    const res = await fetch(`${API_BASE}/mentorResponses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || '멘토 신청 제출에 실패했습니다.');
    }
};
