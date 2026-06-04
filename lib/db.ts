import { Client } from '@neondatabase/serverless';
import { getRequestContext } from '@cloudflare/next-on-pages';

const databaseUrl = process.env.DATABASE_URL;

// Helper to check and get Cloudflare D1 database binding
function getD1Database() {
  try {
    const ctx = getRequestContext();
    return ctx?.env?.DB;
  } catch (e) {
    return null;
  }
}

// Raw query runner (does not trigger initDb recursion)
async function rawQuery(d1: any, text: string, params?: any[]) {
  if (d1) {
    // Translate Postgres $1, $2 placeholders to SQLite ?1, ?2
    const sqliteQuery = text.replace(/\$(\d+)/g, '?$1');
    const stmt = d1.prepare(sqliteQuery);
    const bound = params && params.length > 0 ? stmt.bind(...params) : stmt;
    
    const res = await bound.all();
    return res.results || [];
  }

  if (databaseUrl) {
    const client = new Client(databaseUrl);
    await client.connect();
    try {
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      await client.end();
    }
  }

  return [];
}

// Simple query runner
export async function query(text: string, params?: any[]) {
  await initDb();
  const d1 = getD1Database() as any;
  return rawQuery(d1, text, params);
}

// Track initialization state
let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initDb() {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  const d1 = getD1Database();
  const hasDb = !!d1 || !!databaseUrl;
  if (!hasDb) return; // Cannot initialize yet (e.g. called during module evaluation outside request context)

  initPromise = (async () => {
    try {
      if (d1) {
        // Create tables on D1 (SQLite)
        await rawQuery(d1, `
          CREATE TABLE IF NOT EXISTS cars (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            model TEXT NOT NULL,
            registration_number TEXT NOT NULL,
            fuel_type TEXT NOT NULL,
            last_service TEXT,
            next_service TEXT,
            mileage INTEGER DEFAULT 0
          )
        `);

        await rawQuery(d1, `
          CREATE TABLE IF NOT EXISTS income (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
          )
        `);

        await rawQuery(d1, `
          CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
          )
        `);

        await rawQuery(d1, `
          CREATE TABLE IF NOT EXISTS services (
            id TEXT PRIMARY KEY,
            car_id TEXT,
            car_name TEXT NOT NULL,
            service_type TEXT NOT NULL,
            description TEXT,
            scheduled_date TEXT NOT NULL,
            status TEXT NOT NULL,
            cost REAL DEFAULT 0
          )
        `);
      } else if (databaseUrl) {
        // Fallback to Neon/Postgres initialization
        await rawQuery(null, `
          CREATE TABLE IF NOT EXISTS cars (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            model TEXT NOT NULL,
            registration_number TEXT NOT NULL,
            fuel_type TEXT NOT NULL,
            last_service TEXT,
            next_service TEXT,
            mileage INTEGER DEFAULT 0
          )
        `);

        await rawQuery(null, `
          CREATE TABLE IF NOT EXISTS income (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
          )
        `);

        await rawQuery(null, `
          CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
          )
        `);

        await rawQuery(null, `
          CREATE TABLE IF NOT EXISTS services (
            id TEXT PRIMARY KEY,
            car_id TEXT,
            car_name TEXT NOT NULL,
            service_type TEXT NOT NULL,
            description TEXT,
            scheduled_date TEXT NOT NULL,
            status TEXT NOT NULL,
            cost REAL DEFAULT 0
          )
        `);
      }

      isInitialized = true;
      console.log("Database tables initialized successfully (without dummy data seeding).");
    } catch (error) {
      console.error("Failed to initialize database tables:", error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}
