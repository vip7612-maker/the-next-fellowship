-- round 컬럼 추가 마이그레이션
-- 실행: turso db shell <DB_NAME> < migration_round.sql

ALTER TABLE applicants ADD COLUMN round INTEGER NOT NULL DEFAULT 2;

-- 오늘(2026-04-22) 이전 기존 신청자를 모두 1회차로 설정
UPDATE applicants SET round = 1 WHERE date <= '2026-04-22';
