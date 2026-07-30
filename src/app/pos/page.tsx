'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PosDefaultRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pos/alameda');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans text-slate-400 text-sm">
      Redirigiendo a Caja POS Alameda...
    </div>
  );
}
