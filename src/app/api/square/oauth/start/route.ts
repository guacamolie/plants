import { NextResponse } from 'next/server';

// Replace with your Square application credentials
const SQUARE_CLIENT_ID = process.env.SQUARE_CLIENT_ID;
const SQUARE_REDIRECT_URI = process.env.SQUARE_REDIRECT_URI || 'http://localhost:3000/api/square/oauth/callback';
const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';

export async function GET() {
  if (!SQUARE_CLIENT_ID) {
    return NextResponse.json({ error: 'Missing Square client ID' }, { status: 500 });
  }

  const baseUrl = SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

  const params = new URLSearchParams({
    client_id: SQUARE_CLIENT_ID,
    scope: 'ITEMS_READ MERCHANT_PROFILE_READ',
    session: 'false',
    redirect_uri: SQUARE_REDIRECT_URI,
    state: 'vendor-onboarding',
    response_type: 'code',
  });

  const authUrl = `${baseUrl}/oauth2/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
