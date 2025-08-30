import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

// Optionally, add Square signature verification here for production
//todo testwebhooks on live account sandbox not supported for catalog

export async function POST(req: NextRequest) {
  const event = await req.json();
  if (!MONGODB_URI) {
    return NextResponse.json({ error: 'Missing MongoDB URI' }, { status: 500 });
  }

  // Only handle catalog item events
  if (
    event.type !== 'catalog.version.updated' &&
    event.type !== 'catalog.object.created' &&
    event.type !== 'catalog.object.updated' &&
    event.type !== 'catalog.object.deleted'
  ) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // You may want to filter by merchant_id if supporting multiple vendors
  const merchantId = event.merchant_id;
  const object = event.data?.object;
  const objectId = object?.id;
  const objectType = object?.type;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  const plants = db.collection('plants');

  if (event.type === 'catalog.object.deleted' && objectId) {
    await plants.deleteOne({ 'square_id': objectId, merchant_id: merchantId });
  } else if (
    (event.type === 'catalog.object.created' || event.type === 'catalog.object.updated') &&
    objectType === 'ITEM'
  ) {
    // Extract price and SKU from variations if available
    const variations = object?.item_data?.variations || [];
    let price = 0;
    let currency = 'USD';
    let sku = '';
    if (variations.length > 0) {
      const variation = variations[0]?.item_variation_data || variations[0]?.itemVariationData;
      if (variation?.price_money || variation?.priceMoney) {
        price = (variation.price_money?.amount || variation.priceMoney?.amount || 0) / 100;
        currency = variation.price_money?.currency || variation.priceMoney?.currency || 'USD';
      }
      sku = variation?.sku || '';
    }
    await plants.updateOne(
      { 'square_id': objectId, merchant_id: merchantId },
      {
        $set: {
          square_id: objectId,
          merchant_id: merchantId,
          name: object?.item_data?.name,
          description: object?.item_data?.description,
          image: object?.item_data?.image_url || object?.item_data?.imageUrl || '',
          price,
          currency,
          sku,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  await client.close();
  return NextResponse.json({ ok: true });
}
