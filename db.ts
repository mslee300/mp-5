// db.ts
import { MongoClient, Db, Collection } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in .env.local');
}

// optional: change this to whatever you want your database to be called
const DB_NAME = process.env.MONGO_DB_NAME || 'cs391-url-shortener';

let client: MongoClient;
let db: Db;

async function connectToDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  }
  return db;
}

/**
 * Utility to grab any collection by name
 */
export async function getCollection<T = any>(
  collectionName: string
): Promise<Collection<T>> {
  const database = await connectToDatabase();
  return database.collection<T>(collectionName);
}
