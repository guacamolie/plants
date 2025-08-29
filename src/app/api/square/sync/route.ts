import { NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN!,
    environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  });
  try {
    const { result } = await client.catalogApi.listCatalog(undefined, 'ITEM');
    const items = (result.objects || []) as any[];
    const db = (await clientPromise).db();
    const bulkOps = items.map((item: any) => ({
      updateOne: {
        filter: { 'square_id': item.id },
        update: {
          $set: {
            square_id: item.id,
            name: item.itemData?.name,
            description: item.itemData?.description,
            image: item.itemData?.imageUrl || '',
            price: item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount / 100 || 0,
            currency: item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.currency || 'USD',
            updatedAt: new Date(),
          }
        },
        upsert: true
      }
    }));
    if (bulkOps.length > 0) {
      await db.collection('plants').bulkWrite(bulkOps);
    }
    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
