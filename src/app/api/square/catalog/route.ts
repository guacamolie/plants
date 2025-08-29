import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';

export async function GET() {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  });
  try {
    const { result } = await client.catalogApi.listCatalog(undefined, 'ITEM');
    return NextResponse.json({ items: result.objects || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
