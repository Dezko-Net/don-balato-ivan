import { getServices } from '@/lib/appwrite-admin';
import { ID, Query, OAuthProvider } from 'appwrite';
import { USERS_COLLECTION_ID } from '@/lib/appwrite-admin';
import { upsertUserProfile } from '@/lib/users-db';

function getAccount() { return getServices().account; }
function getDatabases() { return getServices().databases; }
const account = { 
  listSessions: () => getAccount().listSessions(),
  deleteSession: (id: string) => getAccount().deleteSession(id),
  createEmailPasswordSession: (e: string, p: string) => getAccount().createEmailPasswordSession(e, p),
  create: (id: string, e: string, p: string, n: string) => getAccount().create(id, e, p, n),
  get: () => getAccount().get(),
  updateName: (n: string) => getAccount().updateName(n),
  createRecovery: (e: string, u: string) => getAccount().createRecovery(e, u),
  createOAuth2Session: (p: any, s: string, f: string) => getAccount().createOAuth2Session(p, s, f),
};
const databases = {
  createDocument: (dbId: string, col: string, id: string, data: any) => getDatabases().createDocument(dbId, col, id, data),
  listDocuments: (dbId: string, col: string, queries?: any[]) => getDatabases().listDocuments(dbId, col, queries),
  updateDocument: (dbId: string, col: string, id: string, data: any) => getDatabases().updateDocument(dbId, col, id, data),
};

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  birthDate?: string;
  isWholesale?: boolean;
  createdAt: string;
  updatedAt: string;
}

export class AuthService {
  // Limpiar todas las sesiones activas
  static async clearAllSessions(): Promise<void> {
    try {
      // Intentar eliminar la sesión actual primero (más rápido)
      try {
        await account.deleteSession('current');
      } catch {
        // puede fallar si ya no hay sesión
      }
      // Eliminar el resto de sesiones activas
      try {
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
          try { await account.deleteSession(session.$id); } catch { /* ignorar */ }
        }
      } catch { /* ignorar */ }
    } catch (error) {
      console.log('No sessions to clear or error clearing sessions:', error);
    } finally {
      // Limpiar siempre localStorage de tokens Appwrite y cachés de sesión
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('cookieFallback') || 
            key.includes('a_session') || 
            key.includes('appwrite') || 
            key.includes('yaxsel_auth_')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        // Limpiar cookies de sesión de Appwrite
        document.cookie.split(';').forEach(c => {
          const name = c.trim().split('=')[0];
          if (name && (name.includes('a_session') || name.includes('appwrite'))) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
      }
    }
  }

  // Login con email y contraseña
  static async login(email: string, password: string) {
    try {
      // Limpiar todas las sesiones existentes
      await this.clearAllSessions();

      // Crear nueva sesión
      const session = await account.createEmailPasswordSession(email, password);
      
      // Obtener datos del usuario directamente desde Appwrite Auth
      const currentUser = await account.get();
      
      // Crear objeto de usuario con datos de Auth
      const user: User = {
        id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name || 'Usuario',
        phone: currentUser.phone || undefined,
        createdAt: currentUser.$createdAt || new Date().toISOString(),
        updatedAt: currentUser.$updatedAt || new Date().toISOString()
      };

      try {
        await upsertUserProfile({
          userId: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name || 'Usuario',
          phone: currentUser.phone || '',
        });
      } catch (dbError) {
        console.log('No se pudo sincronizar perfil en users:', dbError);
      }

      return { success: true, user };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }

  // Registro de nuevo usuario
  static async register(email: string, password: string, name: string, phone?: string, rut?: string, birthDate?: string) {
    try {
      // Limpiar todas las sesiones existentes
      await this.clearAllSessions();

      // Crear cuenta en Appwrite
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Crear sesión automáticamente
      await account.createEmailPasswordSession(email, password);

      // Guardar phone, rut y fecha de nacimiento en preferencias del usuario
      if (phone || rut || birthDate) {
        try {
          const prefs: Record<string, string> = {};
          if (phone) prefs.phone = phone;
          if (rut) prefs.rut = rut;
          if (birthDate) prefs.birthDate = birthDate;
          await getAccount().updatePrefs(prefs);
        } catch (prefError) {
          console.log('Error saving prefs:', prefError);
        }
      }

      // Crear objeto de usuario con datos de Auth
      const userObj: User = {
        id: user.$id,
        email: user.email,
        name: user.name || name,
        phone: phone,
        createdAt: user.$createdAt || new Date().toISOString(),
        updatedAt: user.$updatedAt || new Date().toISOString()
      };

      try {
        await upsertUserProfile({
          userId: user.$id,
          email: user.email,
          name: user.name || name,
          phone: phone || '',
        });
      } catch (dbError) {
        console.log('No se pudo sincronizar perfil en users:', dbError);
      }

      return { success: true, user: userObj };
    } catch (error: any) {
      console.error('Register error:', error);
      const msg = error?.message || '';
      // Handle "user already exists" specifically
      if (msg.includes('already exists') || error?.code === 409 || error?.type === 'user_already_exists') {
        return {
          success: false,
          error: 'Ya existe una cuenta con este correo electrónico. Intenta iniciar sesión.'
        };
      }
      return {
        success: false,
        error: msg || 'Error al registrarse'
      };
    }
  }

  // Crear documento de usuario en la base de datos
  private static async createUserDocument(user: any): Promise<User> {
    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
      if (!databaseId) {
        throw new Error('Database ID not configured');
      }

      const doc = await databases.createDocument(
        databaseId,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          email: user.email,
          name: user.name,
          phone: user.phone || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );

      return {
        id: doc.$id,
        email: doc.email,
        name: doc.name,
        phone: doc.phone || undefined,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt
      };
    } catch (error: any) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      await this.clearAllSessions();
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Intentar limpiar localStorage aunque haya error en la API
      if (typeof window !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('cookieFallback') || key.includes('a_session') || key.includes('appwrite'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      }
      return { success: true }; // retornar success igual para forzar el redirect
    }
  }

  // Background fetch
  private static async _fetchAndCacheUser(): Promise<User | null> {
    try {
      const currentUser = await account.get();
      
      let isWholesale = false;
      try {
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
        const userDoc = await databases.listDocuments(
          databaseId,
          USERS_COLLECTION_ID,
          [Query.equal('userId', currentUser.$id)]
        );
        if (userDoc.documents.length > 0) {
          isWholesale = userDoc.documents[0].isWholesale || false;
        }
      } catch (dbError) {
        console.log('Error fetching user from database:', dbError);
      }
      
      const user: User = {
        id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name || 'Usuario',
        phone: currentUser.phone || undefined,
        isWholesale,
        createdAt: currentUser.$createdAt || new Date().toISOString(),
        updatedAt: currentUser.$updatedAt || new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('yaxsel_auth_user', JSON.stringify(user));
        localStorage.setItem('yaxsel_auth_time', Date.now().toString());
      }
      return user;
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('yaxsel_auth_user');
        localStorage.removeItem('yaxsel_auth_time');
      }
      return null;
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(): Promise<User | null> {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('yaxsel_auth_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const lastFetch = Number(localStorage.getItem('yaxsel_auth_time') || '0');
          // Update background only if older than 1 hour (3600 seconds)
          if (Date.now() - lastFetch > 3600 * 1000) {
            this._fetchAndCacheUser().catch(() => {});
          }
          return parsed;
        } catch {
          /* ignore JSON parse errors */
        }
      }
    }
    return await this._fetchAndCacheUser();
  }

  // Verificar si está logueado
  static async isLoggedIn(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch (error) {
      // Si hay error, no intentar limpiar sesiones (ya no hay sesión válida)
      return false;
    }
  }

  // Actualizar perfil
  static async updateProfile(updates: Partial<User>) {
    try {
      // Actualizar en Appwrite Auth si es necesario
      if (updates.name) {
        await account.updateName(updates.name);
      }

      // Actualizar documento en la base de datos
      const currentUser = await account.get();
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a62e7440033d2278d28';
      if (!databaseId) {
        return { success: false, error: 'Database ID not configured' };
      }

      const userDoc = await databases.listDocuments(
        databaseId,
        USERS_COLLECTION_ID,
        [Query.equal('userId', currentUser.$id)]
      );

      if (userDoc.documents.length > 0) {
        const docId = userDoc.documents[0].$id;
        const updatedDoc = await databases.updateDocument(
          databaseId,
          USERS_COLLECTION_ID,
          docId,
          {
            name: updates.name,
            phone: updates.phone || ''
          }
        );

        const user: User = {
          id: updatedDoc.$id,
          email: updatedDoc.email,
          name: updatedDoc.name,
          phone: updatedDoc.phone || undefined,
          createdAt: updatedDoc.$createdAt,
          updatedAt: updatedDoc.$updatedAt
        };

        return { success: true, user };
      }

      return { success: false, error: 'Usuario no encontrado' };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar perfil'
      };
    }
  }

  // Recuperar contraseña
  static async forgotPassword(email: string) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return { success: true };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message || 'Error al enviar correo de recuperación'
      };
    }
  }

  // Login con Google (OAuth)
  static async loginWithGoogle() {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/success`,
        `${window.location.origin}/failure`
      );
      return { success: true };
    } catch (error: any) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión con Google'
      };
    }
  }
}
