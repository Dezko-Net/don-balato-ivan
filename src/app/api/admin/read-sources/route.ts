import { NextResponse } from 'next/server';
import { getReadsSummary } from '@/lib/appwrite-read-tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  const summary = getReadsSummary(1440); // full day (24 hours)
  return NextResponse.json(summary);
}
