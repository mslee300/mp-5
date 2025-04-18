// app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import { getCollection } from '@/db';

interface AliasDoc {
  alias: string;
  url: string;
}

export async function POST(request: Request) {
  const { alias, url } = await request.json() as AliasDoc;

  // Validate that alias is nonempty and URL is well‑formed
  if (!alias.trim()) {
    return NextResponse.json({ error: 'Alias cannot be empty' }, { status: 400 });
  }
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const coll = await getCollection<AliasDoc>('aliases');

  // Check for collisions
  if (await coll.findOne({ alias })) {
    return NextResponse.json({ error: 'Alias already taken' }, { status: 409 });
  }

  // Insert
  await coll.insertOne({ alias, url });

  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  return NextResponse.json({ shortUrl: `${base}/${alias}` });
}
