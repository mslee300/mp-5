// app/[alias]/route.ts
import { NextResponse } from 'next/server';
import { getCollection } from '@/db';

interface AliasDoc {
  alias: string;
  url: string;
}

export async function GET(
  _: Request,
  { params }: { params: { alias: string } }
) {
  const coll = await getCollection<AliasDoc>('aliases');
  const rec = await coll.findOne({ alias: params.alias });

  if (!rec) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Redirect immediately
  return NextResponse.redirect(rec.url);
}
