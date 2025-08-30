import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET() {
  if (!MONGODB_URI) {
    return NextResponse.json({ error: 'Missing MongoDB URI' }, { status: 500 });
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const vendors = db.collection('vendors');
  const allVendors = await vendors.find({}).toArray();
  await client.close();
  return NextResponse.json(allVendors);
}

export async function POST(req: Request) {
  if (!MONGODB_URI) {
    return NextResponse.json({ error: 'Missing MongoDB URI' }, { status: 500 });
  }
  const { merchant_id, status } = await req.json();
  if (!merchant_id || !status) {
    return NextResponse.json({ error: 'Missing merchant_id or status' }, { status: 400 });
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const vendors = db.collection('vendors');
  const result = await vendors.updateOne(
    { merchant_id },
    { $set: { status } }
  );
  await client.close();
  return NextResponse.json({ success: true, result });
}
