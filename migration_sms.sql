-- 문자 메시지 템플릿
CREATE TABLE IF NOT EXISTS sms_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- 문자 발송 이력 (배치 단위)
CREATE TABLE IF NOT EXISTS sms_send_logs (
    id TEXT PRIMARY KEY,
    groupId TEXT,
    templateId TEXT,
    title TEXT,
    content TEXT NOT NULL,
    targetType TEXT NOT NULL,
    targetCount INTEGER NOT NULL,
    successCount INTEGER NOT NULL DEFAULT 0,
    failCount INTEGER NOT NULL DEFAULT 0,
    isLms INTEGER NOT NULL DEFAULT 0,
    sentAt TEXT NOT NULL,
    rawResult TEXT
);

-- 발송 이력 - 개별 수신자
CREATE TABLE IF NOT EXISTS sms_send_recipients (
    id TEXT PRIMARY KEY,
    sendLogId TEXT NOT NULL,
    name TEXT,
    phone TEXT NOT NULL,
    status TEXT,
    errorMessage TEXT,
    FOREIGN KEY (sendLogId) REFERENCES sms_send_logs(id)
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_sentAt ON sms_send_logs(sentAt DESC);
CREATE INDEX IF NOT EXISTS idx_sms_recipients_logId ON sms_send_recipients(sendLogId);
CREATE INDEX IF NOT EXISTS idx_sms_templates_updated ON sms_templates(updatedAt DESC);
