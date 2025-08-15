import Database from "bun:sqlite";

export const db = new Database(process.env.DATABASE!);

db.run(`
    CREATE TABLE IF NOT EXISTS count (
        count INTEGER NOT NULL
    )
`);

let rows = db.query("SELECT * FROM count LIMIT 1").all();
if (rows.length === 0) {
    db.run(`INSERT INTO count (count) VALUES (0)`);
}

export function getCount(): number {
    let rows = db.query("SELECT * FROM count LIMIT 1").all();
    let row = rows[0] as { count: number; };

    return row.count;
}

export function updateCount(count: number) {
    const query = db.prepare("UPDATE count SET count = ?");
    query.run(count);
}
