import { Database } from 'bun:sqlite'; const db = new Database('./data/api.db'); console.log(JSON.stringify(db.query('SELECT role, content FROM messages;').all(), null, 2));
