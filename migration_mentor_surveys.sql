-- 회차별 멘토 신청 설문 (Mentor Survey)
-- 각 회차마다 별도 설문을 생성하고 QR 코드를 부여한다.

CREATE TABLE IF NOT EXISTS mentor_surveys (
    id TEXT PRIMARY KEY,
    round INTEGER NOT NULL,
    title TEXT NOT NULL,
    eventDate TEXT,
    location TEXT,
    capacity TEXT,
    description TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mentor_survey_responses (
    id TEXT PRIMARY KEY,
    surveyId TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    university TEXT NOT NULL,
    grade TEXT NOT NULL,
    major TEXT NOT NULL,
    attendance TEXT NOT NULL,
    transport TEXT,
    motivation TEXT NOT NULL,
    shareStory TEXT NOT NULL,
    experience TEXT,
    consentPersonal INTEGER NOT NULL DEFAULT 0,
    consentImage INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (surveyId) REFERENCES mentor_surveys(id)
);

CREATE INDEX IF NOT EXISTS idx_mentor_surveys_round ON mentor_surveys(round DESC);
CREATE INDEX IF NOT EXISTS idx_mentor_surveys_active ON mentor_surveys(isActive);
CREATE INDEX IF NOT EXISTS idx_mentor_responses_surveyId ON mentor_survey_responses(surveyId);
CREATE INDEX IF NOT EXISTS idx_mentor_responses_createdAt ON mentor_survey_responses(createdAt DESC);
