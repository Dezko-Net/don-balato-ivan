'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadErpConfig } from '@/lib/posConfig';

export default function PosDefaultRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    loadErpConfig()
      .then(parsed => {
        if (parsed && Array.isArray(parsed.branches) && parsed.branches.length > 0) {
          const active = parsed.branches.find((b: any) => b.active !== false);
          if (active) {
            const slug = active.slug || active.name?.toLowerCase().replace(/\s+/g, '-');
            router.replace(`/pos/${slug}`);
            return;
          }
        }
        router.replace('/pos/chacabuco-08');
      })
      .catch(() => {
        router.replace('/pos/chacabuco-08');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 font-sans">
      <div className="w-9 h-9 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Redirigiendo al Punto de Venta…</p>
    </div>
  );
}
