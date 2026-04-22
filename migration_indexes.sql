-- The Next Fellowship DB 인덱스 마이그레이션
-- 실행: turso db shell <DB_NAME> < migration_indexes.sql

CREATE INDEX IF NOT EXISTS idx_applicants_date ON applicants(date DESC);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_topic_votes_topicId ON topic_votes(topicId);
CREATE INDEX IF NOT EXISTS idx_topics_votes ON topics(votes DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_createdAt ON surveys(createdAt DESC);
