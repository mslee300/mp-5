// db.ts
import { MongoClient, Db, Collection, Document } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in .env.local');
}

const DB_NAME = process.env.MONGO_DB_NAME || 'cs391-url-shortener';

let client: MongoClient;
let database: Db;

async function connectToDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    database = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  }
  return database;
}

/**
 * Get a MongoDB collection by name.
 *
 * @param name - Collection name to retrieve
 * @returns A Collection<T>
 */
export async function getCollection<T extends Document>(
  name: string
): Promise<Collection<T>> {
  const db = await connectToDatabase();
  return db.collection<T>(name);
}
