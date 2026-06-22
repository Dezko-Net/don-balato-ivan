import { NextResponse } from 'next/server';
import { getKeniaConfig } from '@/lib/kenia-runtime';
import { unstable_cache } from 'next/cache';

const getCachedKeniaStatus = unstable_cache(
  async () => {
    const config = await getKeniaConfig();
    return { isEnabled: config.isEnabled !== false };
  },
  ['kenia-status-key'],
  { revalidate: 86400, tags: ['kenia-status'] } // Cache for 24 hours
);

export async function GET() {
  try {
    const status = await getCachedKeniaStatus();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ isEnabled: true });
  }
}
