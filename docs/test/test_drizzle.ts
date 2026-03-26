import { drizzle } from "drizzle-orm/bun-sql"; import { sql } from "bun"; try { const db = drizzle(sql); console.log("Success with bun-sql"); } catch(err) { console.error(err); }
