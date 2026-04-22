CREATE TABLE IF NOT EXISTS applicants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    school TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    careerReason TEXT NOT NULL,
    motivation TEXT NOT NULL,
    questionForYoon TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    date TEXT NOT NULL,
    role TEXT DEFAULT '학생'
);

CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    authorName TEXT NOT NULL,
    authorPhone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topic_votes (
    id TEXT PRIMARY KEY,
    topicId TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

-- 초기 주제 데이터 삽입 (존재하지 않을 경우에 대비하여 INSERT OR IGNORE 사용)
INSERT OR IGNORE INTO topics (id, title, description, votes, createdAt, authorName, authorPhone) VALUES
('1', '경제,금융', '자본주의의 흐름을 읽고 새로운 가치를 창출하는 경제와 금융의 세계.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('2', '자유전공학부', '나만의 길을 스스로 설계하는 융합 인재의 시대를 대비합니다.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('3', '교육계열', '누군가의 인생과 미래를 빚어내는 가장 가치 있는 일, 교육의 진정한 의미.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('4', 'AI분야', '우리의 일상을 혁신하고 세상을 바꾸는 인공지능 기술의 오늘과 내일.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('5', '생명화학', '인류가 직면한 난제를 해결하는 생명과학과 화학의 무한한 가능성.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('6', '건축', '사람의 시간과 공간을 잇고 새로운 뼈대를 세우는 건축의 본질.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('7', '예체능(음악,미술,체육)', '한계를 극복하는 열정과 창의성으로 세상에 감동을 전합니다.', 0, '2026-03-09', '운영진', '000-0000-0000'),
('8', '보건(간호)', '생명의 가장 가까이에서 돌봄과 헌신의 가치를 실천하는 의료 복지.', 0, '2026-03-09', '운영진', '000-0000-0000');

CREATE TABLE IF NOT EXISTS surveys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    satisfaction INTEGER NOT NULL,
    helpfulness INTEGER NOT NULL,
    feedback TEXT NOT NULL,
    constructiveOpinion TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

-- 인덱스 (신규 DB에는 아래를 함께 실행, 기존 DB는 migration_indexes.sql 참고)
CREATE INDEX IF NOT EXISTS idx_applicants_date ON applicants(date DESC);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_topic_votes_topicId ON topic_votes(topicId);
CREATE INDEX IF NOT EXISTS idx_topics_votes ON topics(votes DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_createdAt ON surveys(createdAt DESC);

-- topic_votes 중복 투표 방지: 현재 앱 레벨(votes.ts)에서 검증 중.
-- DB 레벨 UNIQUE 제약 추가 시 테이블 재생성 필요:
--   CREATE TABLE topic_votes_new (..., UNIQUE(topicId, name, phone));
--   INSERT INTO topic_votes_new SELECT * FROM topic_votes;
--   DROP TABLE topic_votes; ALTER TABLE topic_votes_new RENAME TO topic_votes;
