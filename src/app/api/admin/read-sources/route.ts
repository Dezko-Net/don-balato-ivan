import { NextResponse } from 'next/server';
import { getReadsSummary } from '@/lib/appwrite-read-tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  const summary = getReadsSummary(30); // last 30 minutes
  return NextResponse.json(summary);
}
