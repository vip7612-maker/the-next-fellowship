import { createClient } from '@libsql/client';

const db = createClient({
    url: "libsql://the-next-fellowship-vip7612-maker.aws-ap-northeast-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMxMDM4NjksImlkIjoiMDE5Y2Q1MzktM2QwMS03N2MyLWE5MDAtNGRlYmM0YjNlOGY4IiwicmlkIjoiYzE3N2JiNDQtNTEzMi00Y2RmLThkMWQtYWYyY2QyNmYzMjU5In0.TkxmD1k_X03LfLIG4JmYHwNxeUfILLL_4bjCLVRKXdt9vXb1ZIjh8Ltj8EY2NG_1zbB7lOOsRDTabCo-CzzqCg"
});

async function run() {
    try {
        console.log("Creating surveys table...");
        await db.execute(`
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
        `);
        console.log("Table created successfully!");
        process.exit(0);
    } catch(err) {
        console.error("Failed to create table:", err);
        process.exit(1);
    }
}

run();
