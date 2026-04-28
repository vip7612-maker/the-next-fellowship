-- 생기부 첨부(선택) — 신청자별 파일 1건
ALTER TABLE applicants ADD COLUMN transcriptFileName TEXT;
ALTER TABLE applicants ADD COLUMN transcriptMimeType TEXT;
ALTER TABLE applicants ADD COLUMN transcriptDataUrl TEXT;
ALTER TABLE applicants ADD COLUMN transcriptSizeBytes INTEGER;
