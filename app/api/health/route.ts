// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { getCollection } from '@/db';

export async function GET() {
  const coll = await getCollection('foobar');
  return NextResponse.json({
    ok: true,
    namespace: coll.namespace
  });
}
