import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function withCORS(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*'); // Or restrict to your app's domain
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return res;
}

export async function OPTIONS() {
  // Preflight CORS support
  return withCORS(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return withCORS(NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 }));
  }
  const token = auth.substring(7);
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return withCORS(NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }));
  }
  const db = (await clientPromise).db();
  const plants = await db.collection('plants').find({}).toArray();
  console.log('PLANTS:', plants); 
  // Recursively convert all BigInt values to strings for JSON serialization
  function convertBigInt(obj: any): any {
    if (typeof obj === 'bigint') return obj.toString();
    if (Array.isArray(obj)) return obj.map(convertBigInt);
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, convertBigInt(v)])
      );
    }
    return obj;
  }
  const safePlants = plants.map(convertBigInt);
  return withCORS(NextResponse.json(safePlants));
}
