import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  const { email, name, password } = await req.json();
  if (!email || !name || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('users').findOne({ $or: [{ email }, { name }] });
  if (existing) {
    return NextResponse.json({ error: 'Email or name already exists' }, { status: 409 });
  }
  const hashed = await hash(password, 10);
  await db.collection('users').insertOne({ email, name, password: hashed });
  return NextResponse.json({ success: true });
}
