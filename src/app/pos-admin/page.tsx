'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PosAdminDefaultRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pos-admin/alameda');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans text-gray-500 text-sm">
      Redirigiendo a POS Alameda...
    </div>
  );
}
