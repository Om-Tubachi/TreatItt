import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import { api, setToken } from "../lib/api";
import { GoogleSignUpData, SignUpData, User } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = 'accessToken';

const persistToken = async (token: string) => {
  console.log('coming here 2');
  
  setToken(token);
  if (Platform.OS !== 'web') await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const clearToken = async () => {
  setToken(null);
  if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(TOKEN_KEY);
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; supabaseToken?: string }>;
  signUpWithGoogle: (data: GoogleSignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signUpWithGoogle: async () => ({ error: null }),
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (Platform.OS !== 'web') {
          const stored = await SecureStore.getItemAsync(TOKEN_KEY);
          if (!stored) { setUser(null); return; }
          setToken(stored);
        }
        const res = await api.get("/users/auth/me");
        setUser(res.data.data);
      } catch (err: any) {
        console.log('[AUTH] Bootstrap failed:', err.response);
        await clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        try {
          const res = await api.post("/users/auth/login/google", { supabaseAccessToken: session.access_token });
          await persistToken(res.data.data.accessToken);
          setUser(res.data.data.user);
        } catch (loginErr: any) {
          if (loginErr.response?.status === 400) {
            sessionStorage.setItem('supabaseToken', session.access_token);
            router.replace({ pathname: '/(auth)/signup', params: { supabaseToken: session.access_token } });
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
  console.log('coming here 1');

      const res = await api.post("/users/auth/login", { email, password });
      await persistToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      return { error: null };
    } catch (err: any) {
      console.log( err.response?.data);
      
      return { error: err.response?.data?.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      const res = await api.post("/users/auth/signup", data);
      await persistToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
        return { error: null };
      }

      const redirectUri = Linking.createURL("/");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      });
      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        if (result.type === "success" && result.url) {
          const urlObj = new URL(result.url.replace("#", "?"));
          const supabaseToken = urlObj.searchParams.get("access_token");
          if (!supabaseToken) throw new Error("No token received from Google");

          try {
            const res = await api.post("/users/auth/login/google", { supabaseAccessToken: supabaseToken });
            await persistToken(res.data.data.accessToken);
            setUser(res.data.data.user);
            return { error: null };
          } catch (loginErr: any) {
            if (loginErr.response?.status === 400) return { error: null, supabaseToken };
            throw loginErr;
          }
        }
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Google sign in failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async (data: GoogleSignUpData) => {
    try {
      setIsLoading(true);
      const res = await api.post("/users/auth/signup/google", data);
      await persistToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || "Google signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await api.post("/users/auth/logout");
    } finally {
      await clearToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signInWithGoogle, signUpWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};