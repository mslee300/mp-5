// app/[alias]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ alias: string }> }
): Promise<NextResponse> {
  // await the params promise to get your alias
  const { alias } = await params;

  const coll = await getCollection<{ alias: string; url: string }>('aliases');
  const rec  = await coll.findOne({ alias });

  if (!rec) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.redirect(rec.url);
}
