import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';

export async function GET() {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  });
  try {
    const { result } = await client.catalogApi.listCatalog(undefined, 'ITEM');
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
    const safeObjects = convertBigInt(result.objects || []);
    return NextResponse.json({ items: safeObjects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
