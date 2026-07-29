'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getServices, getAppwriteConfig, ORDERS_COLLECTION } from '@/lib/appwrite';
import { Query } from 'appwrite';

/**
 * Hook que devuelve el número de pedidos del usuario con estado 'paid'
 * (Stock confirmado — esperando transferencia bancaria).
 * También retorna el $id del primer pedido para enlace directo.
 * Refresca cada 60 segundos.
 *
 * NOTA: los pedidos se pueden crear con USERID = 'guest' (checkout sin sesión)
 * o con un id distinto, pero siempre guardan CUSTOMEREMAIL. Por eso se replica
 * la misma cadena de fallback que usa /cuenta/pedidos: USERID -> CUSTOMEREMAIL
 * -> userId (minúsculas). Sin este fallback el conteo queda en 0 para pedidos
 * hechos como invitado.
 */
export function useStockConfirmedOrders() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [stockConfirmedCount, setStockConfirmedCount] = useState(0);
  const [firstOrderId, setFirstOrderId] = useState<string | null>(null);
  const [firstOrderStatus, setFirstOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !isLoggedIn || !user?.id) {
      setStockConfirmedCount(0);
      setFirstOrderId(null);
      setFirstOrderStatus(null);
      return;
    }

    let active = true;

    const fetchOrders = async () => {
      try {
        const { databases } = getServices();
        const { databaseId } = getAppwriteConfig();

        const statusFilter = [
          Query.equal('STATUS', ['paid', 'payment_review', 'payment_confirmed']),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ];

        // 1) Por USERID (caso normal: pedido hecho con sesión iniciada)
        let res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
          Query.equal('USERID', user.id),
          ...statusFilter,
        ]);

        // 2) Fallback por CUSTOMEREMAIL (pedido hecho como invitado)
        if (res.total === 0 && user.email) {
          try {
            res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
              Query.equal('CUSTOMEREMAIL', user.email),
              ...statusFilter,
            ]);
          } catch { /* atributo puede no existir/indexar */ }
        }

        // 3) Fallback por userId en minúsculas (esquema antiguo)
        if (res.total === 0) {
          try {
            res = await databases.listDocuments(databaseId, ORDERS_COLLECTION, [
              Query.equal('userId', user.id),
              ...statusFilter,
            ]);
          } catch { /* atributo puede no existir */ }
        }

        if (active) {
          setStockConfirmedCount(res.total);
          setFirstOrderId(res.documents.length > 0 ? (res.documents[0] as any).$id : null);
          setFirstOrderStatus(res.documents.length > 0 ? (res.documents[0] as any).STATUS : null);
        }
      } catch {
        if (active) {
          setStockConfirmedCount(0);
          setFirstOrderId(null);
          setFirstOrderStatus(null);
        }
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isLoggedIn, isLoading, user?.id, user?.email]);

  return { stockConfirmedCount, firstOrderId, firstOrderStatus };
}
