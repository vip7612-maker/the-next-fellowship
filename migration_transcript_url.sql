-- 생기부 첨부를 Vercel Blob으로 전환: URL 컬럼 추가
-- 기존 transcriptDataUrl 컬럼은 폴백용으로 남겨둔다 (이미 적재된 데이터 보존)
ALTER TABLE applicants ADD COLUMN transcriptUrl TEXT;
