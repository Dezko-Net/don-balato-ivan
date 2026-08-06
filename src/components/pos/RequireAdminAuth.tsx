'use client';

/**
 * RequireAdminAuth — Guard de acceso para zonas POS (/pos, /pos-admin, /pos-visualizer).
 *
 * Al ser dominio público, NINGUNA persona sin la cuenta principal de administrador
 * puede ver estas pantallas. Si no hay sesión admin activa, redirige SIEMPRE a
 * /admin/login?next=<ruta-original> para volver automáticamente tras el login.
 *
 * - 0 lecturas extra a Appwrite: reutiliza la sesión que useAuth ya resuelve al montar la app.
 * - Mismo patrón que src/app/admin/(panel)/layout.tsx (client-side guard).
 */

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdminEmail } from '@/lib/admin-access';
import { ShieldCheck } from 'lucide-react';

export default function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (isLoading) return;
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    const next = encodeURIComponent(`${pathname}${qs}`);

    if (!isLoggedIn) {
      router.replace(`/admin/login?next=${next}`);
      return;
    }
    if (!isAdminEmail(user?.email)) {
      // Cuenta logueada pero NO es la principal → cerrar sesión y pedir admin
      logout().finally(() => router.replace(`/admin/login?next=${next}`));
    }
  }, [isLoading, isLoggedIn, user?.email, pathname, router, logout]);

  // Splash mientras se resuelve la sesión (evita flash de contenido protegido)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div className="w-8 h-8 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-medium tracking-wide">Verificando acceso autorizado…</p>
      </div>
    );
  }

  // Mientras redirige no renderizar NADA del contenido protegido
  if (!isLoggedIn || !isAdminEmail(user?.email)) return null;

  return <>{children}</>;
}
