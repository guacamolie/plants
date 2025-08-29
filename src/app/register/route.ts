import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  const { email, username, password } = await req.json();
  if (!email || !username || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('users').findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return NextResponse.json({ error: 'Email or username already exists' }, { status: 409 });
  }
  const hashed = await hash(password, 10);
  await db.collection('users').insertOne({ email, username, password: hashed });
  return NextResponse.json({ success: true });
}
