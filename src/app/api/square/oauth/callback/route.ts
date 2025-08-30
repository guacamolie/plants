import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const SQUARE_CLIENT_ID = process.env.SQUARE_CLIENT_ID;
const SQUARE_CLIENT_SECRET = process.env.SQUARE_CLIENT_SECRET;
const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';
const MONGODB_URI = process.env.MONGODB_URI;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const baseUrl = SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

  // Exchange code for access token
  const tokenRes = await fetch(`${baseUrl}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: SQUARE_CLIENT_ID,
      client_secret: SQUARE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    return NextResponse.json({ error: tokenData }, { status: 500 });
  }

  // Get merchant info
  const merchantRes = await fetch(`${baseUrl}/v2/merchants/me`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const merchantData = await merchantRes.json();
  if (!merchantRes.ok) {
    return NextResponse.json({ error: merchantData }, { status: 500 });
  }

  // Store vendor in MongoDB (pending approval)
  if (!MONGODB_URI) {
    return NextResponse.json({ error: 'Missing MongoDB URI' }, { status: 500 });
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const vendors = db.collection('vendors');
  await vendors.updateOne(
    { merchant_id: merchantData.merchant.id },
    {
      $set: {
        merchant_id: merchantData.merchant.id,
        business_name: merchantData.merchant.business_name,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        status: 'pending',
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
  await client.close();

  // Redirect to thank you page or show message
  return NextResponse.redirect('/vendors?submitted=1');
}
