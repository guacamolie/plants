import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const db = (await clientPromise).db();
  const plants = await db.collection('plants').find({}).toArray();
  return NextResponse.json(plants);
}
