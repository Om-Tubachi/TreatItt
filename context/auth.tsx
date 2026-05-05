import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router"; // Added router
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import { api } from "../lib/api";
import { GoogleSignUpData, SignUpData, User } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

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
  const router = useRouter(); // Initialize router

  useEffect(() => {
    console.log('[AUTH] Checking existing session...');
    api.get("/users/auth/me")
      .then((res) => {
        console.log('[AUTH] Session found:', res.data.data);
        setUser(res.data.data);
      })
      .catch((err) => {
        console.log('[AUTH] No session:', err.response?.status, err.response?.data?.message);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH WEB] Auth state change:', event, session?.access_token ? 'has token' : 'no token');
      
      if (event === 'SIGNED_IN' && session?.access_token) {
        console.log('[AUTH WEB] Google redirect detected, attempting login...');
        try {
          const res = await api.post("/users/auth/login/google", { supabaseAccessToken: session.access_token });
          console.log('[AUTH WEB] Login success:', res.data.data.user);
          setUser(res.data.data.user);
        } catch (loginErr: any) {
          console.log('[AUTH WEB] Login failed:', loginErr.response?.status, loginErr.response?.data?.message);
          
          if (loginErr.response?.status === 400) {
            console.log('[AUTH WEB] User not found, redirecting to signup via router');
            sessionStorage.setItem('supabaseToken', session.access_token);
            
            // Client-side navigation (preserving state)
            router.replace({
              pathname: '/(auth)/signup',
              params: { supabaseToken: session.access_token }
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post("/users/auth/login", { email, password });
      setUser(res.data.data.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      const res = await api.post("/users/auth/signup", data);
      console.log('[SIGNUP] Success, user:', res.data.data.user);
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
      console.log('[GOOGLE] Starting OAuth flow, platform:', Platform.OS);
      setIsLoading(true);

      if (Platform.OS === 'web') {
        console.log('[GOOGLE WEB] Initiating web OAuth redirect...');
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
      console.log('[GOOGLE] Fatal error:', err.message);
      return { error: err.message || "Google sign in failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async (data: GoogleSignUpData) => {
    try {
      console.log('[GOOGLE SIGNUP] Attempting for:', data.email);
      setIsLoading(true);
      const res = await api.post("/users/auth/signup/google", data);
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
    } catch (err: any) {
    } finally {
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