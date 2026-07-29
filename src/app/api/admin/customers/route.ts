import { NextResponse } from 'next/server';
import { Client, Databases, Query, Users } from 'node-appwrite';
import {
  dedupeUserDocuments,
  isRegisteredUserProfile,
  mergeAuthUsersWithProfiles,
  type UserProfileDoc,
} from '@/lib/users-db';
import {
  aggregateOrdersForUser,
  calculateLoyaltyFromPaidOrders,
  estimatePoints,
  pickPrefs,
  type AdminCustomerRow,
} from '@/lib/admin-customers';
import type { LoyaltyLevelId } from '@/lib/loyalty-levels';
import { getLevelMeta } from '@/lib/loyalty-levels';

export const dynamic = 'force-dynamic';

function getServerDb() {
  const endpoint = (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1').replace(/\/$/, '');
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
  const apiKey = process.env.APPWRITE_API_KEY || '';
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return {
    databases: new Databases(client),
    users: new Users(client),
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  };
}

type AuthUserFull = {
  $id: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: boolean;
  labels?: string[];
  emailVerification?: boolean;
  phoneVerification?: boolean;
  registration?: string;
  accessedAt?: string;
  passwordUpdate?: string;
  $createdAt?: string;
  prefs?: Record<string, unknown>;
};

async function listAuthUsers(usersApi: Users): Promise<AuthUserFull[]> {
  const all: AuthUserFull[] = [];
  const limit = 100;
  try {
    let cursor: string | undefined;
    while (true) {
      const queries = [Query.limit(limit)];
      if (cursor) queries.push(Query.cursorAfter(cursor));
      const res = await usersApi.list({ queries });
      all.push(...(res.users || []).map(u => ({
        $id: u.$id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        status: u.status,
        labels: u.labels,
        emailVerification: u.emailVerification,
        phoneVerification: u.phoneVerification,
        registration: u.registration,
        accessedAt: u.accessedAt,
        passwordUpdate: u.passwordUpdate,
        $createdAt: u.$createdAt,
      })));
      if (!res.users || res.users.length < limit) break;
      cursor = res.users[res.users.length - 1].$id;
    }
  } catch {}
  return all;
}

async function fetchAuthPrefsBatch(usersApi: Users, ids: string[], concurrency = 8): Promise<Map<string, Record<string, unknown>>> {
  const map = new Map<string, Record<string, unknown>>();
  for (let i = 0; i < ids.length; i += concurrency) {
    const chunk = ids.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async id => {
        try {
          const u = await usersApi.get(id);
          if (u.prefs && typeof u.prefs === 'object') map.set(id, u.prefs as Record<string, unknown>);
        } catch {
          /* sin prefs */
        }
      }),
    );
  }
  return map;
}

async function listProfiles(databases: Databases, databaseId: string): Promise<UserProfileDoc[]> {
  const all: UserProfileDoc[] = [];
  try {
    let cursor: string | undefined;
    while (true) {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
      if (cursor) queries.push(Query.cursorAfter(cursor));
      const resp = await databases.listDocuments(databaseId, 'users', queries);
      all.push(...(resp.documents as unknown as UserProfileDoc[]));
      if (resp.documents.length < 100) break;
      cursor = resp.documents[resp.documents.length - 1].$id;
    }
  } catch {}
  return all;
}

type OrderDoc = {
  $id: string;
  USERID?: string;
  STATUS?: string;
  TOTAL?: number;
  CREATEDAT?: number;
  $createdAt?: string;
};

async function listAllOrders(databases: Databases, databaseId: string) {
  const all: OrderDoc[] = [];
  try {
    let cursor: string | undefined;
    while (true) {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
      if (cursor) queries.push(Query.cursorAfter(cursor));
      const resp = await databases.listDocuments(databaseId, 'orders', queries);
      all.push(...(resp.documents as unknown as OrderDoc[]));
      if (resp.documents.length < 100) break;
      cursor = resp.documents[resp.documents.length - 1].$id;
    }
  } catch {}
  return all;
}

function buildCustomerRow(
  profile: UserProfileDoc,
  authById: Map<string, AuthUserFull>,
  prefsByAuthId: Map<string, Record<string, unknown>>,
  orders: OrderDoc[],
): AdminCustomerRow {
  const uid = profile.userId?.trim() || (profile.$id.startsWith('auth:') ? profile.$id.slice(5) : profile.$id);
  const auth = authById.get(uid);
  const prefsRaw = prefsByAuthId.get(uid) || {};
  const prefs = pickPrefs(prefsRaw);

  const orderStats = aggregateOrdersForUser(orders, uid);
  const paidCount = orders.filter(o => 
    o.USERID === uid && 
    ['paid', 'payment_confirmed', 'negotiation', 'shipped', 'delivered'].includes((o.STATUS || '').toLowerCase())
  ).length;
  const loyaltyCalculated = calculateLoyaltyFromPaidOrders(paidCount);
  const loyaltyStored = (String(prefs.loyaltyLevel || 'bronze') as LoyaltyLevelId);
  const loyaltyEffective = loyaltyCalculated;
  const meta = getLevelMeta(loyaltyEffective);

  return {
    $id: profile.$id,
    userId: uid,
    email: (profile.email || auth?.email || '').trim(),
    name: profile.name || auth?.name || profile.email?.split('@')[0] || 'Sin nombre',
    phone: profile.phone || auth?.phone || prefs.phone as string | undefined,
    region: profile.region,
    comuna: profile.comuna,
    address: profile.address,
    isWholesale: Boolean(profile.isWholesale),
    isBanned: Boolean(profile.isBanned),
    adminNotes: profile.adminNotes,
    profileCreatedAt: profile.$createdAt,
    authCreatedAt: auth?.$createdAt,
    lastAccessAt: auth?.accessedAt,
    registrationAt: auth?.registration,
    passwordUpdatedAt: auth?.passwordUpdate,
    emailVerified: Boolean(auth?.emailVerification),
    phoneVerified: Boolean(auth?.phoneVerification),
    authStatus: auth?.status === false ? 'bloqueado_auth' : auth ? 'activo' : 'sin_auth',
    authLabels: auth?.labels || [],
    prefs,
    loyaltyStored,
    loyaltyCalculated,
    loyaltyName: meta.name,
    pointsEstimate: estimatePoints(orderStats.revenuePaid, loyaltyEffective) + Number(prefs.pointsAdjustment || 0),
    orders: orderStats,
    hasProfileDoc: !profile.$id.startsWith('auth:'),
    isAuthOnly: profile.$id.startsWith('auth:'),
  };
}

/** Lista clientes con Auth, prefs, pedidos y nivel VIP calculado. */
export async function GET() {
  if (!process.env.APPWRITE_API_KEY) {
    return NextResponse.json({
      users: [],
      error: 'Falta APPWRITE_API_KEY en Vercel (Settings → Environment Variables).',
    });
  }

  try {
    const { databases, users, databaseId } = getServerDb();
    if (!databaseId) {
      return NextResponse.json({ users: [], error: 'Falta NEXT_PUBLIC_APPWRITE_DATABASE_ID' });
    }

    const [profiles, authUsers, orders] = await Promise.all([
      listProfiles(databases, databaseId),
      listAuthUsers(users),
      listAllOrders(databases, databaseId),
    ]);

    const merged = mergeAuthUsersWithProfiles(profiles, authUsers);
    const registered = dedupeUserDocuments(merged).filter(isRegisteredUserProfile);

    const authById = new Map(authUsers.map(a => [a.$id, a]));
    const authIds = registered
      .map(p => p.userId?.trim() || (p.$id.startsWith('auth:') ? p.$id.slice(5) : ''))
      .filter(Boolean) as string[];
    const prefsByAuthId = await fetchAuthPrefsBatch(users, [...new Set(authIds)]);

    const rows: AdminCustomerRow[] = registered.map(p =>
      buildCustomerRow(p, authById, prefsByAuthId, orders),
    );

    rows.sort((a, b) => new Date(b.profileCreatedAt).getTime() - new Date(a.profileCreatedAt).getTime());

    return NextResponse.json({
      users: rows,
      total: rows.length,
      passwordNote: 'Las contraseñas están hasheadas en Appwrite Auth; no es posible verlas en texto plano.',
    });
  } catch (e) {
    return NextResponse.json(
      { users: [], error: e instanceof Error ? e.message : 'Error al cargar clientes' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!process.env.APPWRITE_API_KEY) {
    return NextResponse.json({ error: 'Falta APPWRITE_API_KEY' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log('[PATCH API] Received body:', body);

    const userId = body.userId || body.id || body.uid;
    const targetPointsRaw = body.targetPoints;

    const targetPoints = typeof targetPointsRaw === 'number'
      ? targetPointsRaw
      : parseInt(String(targetPointsRaw || '0'), 10);

    if (!userId || isNaN(targetPoints)) {
      return NextResponse.json({
        error: `Faltan parámetros obligatorios. userId recibido: "${userId || ''}", targetPoints recibido: "${targetPointsRaw ?? ''}"`
      }, { status: 400 });
    }

    const { users, databases, databaseId } = getServerDb();

    // 1. Calcular basePoints para el usuario basado en sus pedidos
    const ordersRes = await databases.listDocuments(databaseId, 'orders', [
      Query.equal('USERID', userId),
      Query.equal('STATUS', ['paid', 'payment_confirmed', 'negotiation', 'shipped', 'delivered']),
    ]);

    const paidOrdersCount = ordersRes.total;
    const totalSpent = ordersRes.documents.reduce((sum: number, order: any) => sum + (Number(order.TOTAL) || 0), 0);

    const LEVELS = [
      { id: 'bronze', name: 'Bronce', requiredOrders: 0, pointsMultiplier: 1 },
      { id: 'silver', name: 'Plata', requiredOrders: 5, pointsMultiplier: 1.5 },
      { id: 'gold', name: 'Oro', requiredOrders: 10, pointsMultiplier: 2 },
      { id: 'diamond', name: 'Diamante', requiredOrders: 20, pointsMultiplier: 3 },
      { id: 'ruby', name: 'Ruby', requiredOrders: 30, pointsMultiplier: 5 },
    ];

    let calculatedLevel = 'bronze';
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (paidOrdersCount >= LEVELS[i].requiredOrders) {
        calculatedLevel = LEVELS[i].id;
        break;
      }
    }

    const levelIndex = LEVELS.findIndex(l => l.id === calculatedLevel);
    const pointsMultiplier = LEVELS[levelIndex >= 0 ? levelIndex : 0].pointsMultiplier;
    const basePoints = Math.floor((totalSpent / 1000) * pointsMultiplier);

    // 2. El ajuste necesario es el total objetivo menos los puntos base
    const pointsAdjustment = targetPoints - basePoints;

    // 3. Obtener prefs y actualizar
    const user = await users.get(userId);
    const currentPrefs = user.prefs || {};
    
    const newPrefs = {
      ...currentPrefs,
      pointsAdjustment: pointsAdjustment
    };

    const updatedUser = await users.updatePrefs(userId, newPrefs);

    return NextResponse.json({ success: true, prefs: updatedUser });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al actualizar puntos' },
      { status: 500 }
    );
  }
}
