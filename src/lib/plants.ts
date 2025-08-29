import clientPromise from '@/lib/mongodb';
import { Plant } from '@/models/Plant';
import { ObjectId } from 'mongodb';

export async function getPlants(): Promise<Plant[]> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Plant>('plants').find({}).toArray();
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Plant>('plants').findOne({ _id: new ObjectId(id) });
}

export async function addPlant(plant: Omit<Plant, '_id'>): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db.collection<Plant>('plants').insertOne(plant);
}
