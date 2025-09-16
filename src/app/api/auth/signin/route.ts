import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }
  const db = (await clientPromise).db();
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }
  if (!user.password) {
    return NextResponse.json({ error: 'User has no password set. Please register again.' }, { status: 400 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  // Generate JWT token
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const res = NextResponse.json({ success: true });
  res.headers.append(
    'Set-Cookie',
    `jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
  );
  return res;
}
