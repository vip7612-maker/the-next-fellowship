-- 통합 갤러리 (관리자 업로드 → 페이지에서 슬롯 키로 사용)
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    slot TEXT,
    title TEXT NOT NULL,
    description TEXT,
    dataUrl TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    sizeBytes INTEGER,
    width INTEGER,
    height INTEGER,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gallery_slot ON gallery_images(slot);
CREATE INDEX IF NOT EXISTS idx_gallery_createdAt ON gallery_images(createdAt DESC);
