import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const client = uri ? new MongoClient(uri) : null;

export async function getDb() {
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env.local");
  }

  if (!dbName) {
    throw new Error("MONGODB_DB is missing in .env.local");
  }

  if (!client) {
    throw new Error("MongoDB client was not initialized");
  }

  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
 
  return client.db(dbName);
}

export default client;