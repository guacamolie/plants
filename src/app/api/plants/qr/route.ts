import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plantId = searchParams.get('id');
  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const sku = searchParams.get('sku');
  if (!plantId) {
    return NextResponse.json({ error: 'Missing plant id' }, { status: 400 });
  }
  // The QR code can encode a URL or price info. Here, encode a URL to the plant detail page.
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/plants/${plantId}`;
  let label = name ? `${name} - $${price}` : undefined;
  if (sku) {
    label = label ? `${label} (SKU: ${sku})` : `SKU: ${sku}`;
  }
  const qrData = label ? `${url}\n${label}` : url;
  const qr = await QRCode.toDataURL(qrData, { width: 300 });
  return NextResponse.json({ qr });
}
