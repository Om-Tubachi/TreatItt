import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'tempdb_users';
const SESSION_KEY = 'tempdb_session';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  designation?: string;
  username?: string;
  mobileNo?: string;
  industrySector?: string;
}

export interface SignUpData {
  email: string;
  password?: string;
  fullName?: string;
  companyName?: string;
  designation?: string;
  username?: string;
  mobileNo?: string;
  industrySector?: string;
}

export const tempDb = {
  async getUsers(): Promise<any[]> {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async getSession(): Promise<User | null> {
    const data = await AsyncStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  async setSession(user: User | null): Promise<void> {
    if (user) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  },

  async signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
      const users = await this.getUsers();
      if (users.find(u => u.email === data.email || (data.username && u.username === data.username))) {
        return { user: null, error: 'User with this email or username already exists' };
      }
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        ...data,
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Do not log the user in automatically
      const { password, ...safeUser } = newUser;
      
      return { user: safeUser as User, error: null };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { user: null, error: 'Invalid email or password' };
      }
      
      const { password: _, ...sessionUser } = user;
      await this.setSession(sessionUser as User);
      
      return { user: sessionUser as User, error: null };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    try {
      const users = await this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) return { user: null, error: 'User not found' };

      // Protect essential details from being updated in this flow
      const { email, username, password, id, ...allowedUpdates } = data as any;
      
      const updatedUser = { ...users[index], ...allowedUpdates };
      users[index] = updatedUser;
      
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const sessionUser = await this.getSession();
      if (sessionUser && sessionUser.id === userId) {
        // Safe to cast since we just omit password
        const newSession = { ...sessionUser, ...allowedUpdates };
        await this.setSession(newSession);
        return { user: newSession, error: null };
      }
      
      return { user: updatedUser, error: null };
    } catch (e: any) {
      return { user: null, error: e.message };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      await this.setSession(null);
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  async clearDb(): Promise<void> {
    await AsyncStorage.removeItem(USERS_KEY);
    await AsyncStorage.removeItem(SESSION_KEY);
  }
};
