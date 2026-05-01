import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { supabase } from "../lib/supabase";
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

  useEffect(() => {
    api.get("/api/v1/users/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('coming here');

      const res = await api.post("/api/v1/users/auth/login", { email, password });
      setUser(res.data.data.user);
      console.log('Returned from server');

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
      await api.post("/api/v1/auth/signup", data);
      return { error: null };
    } catch (err: any) {
      return { error: err.response?.data?.message || "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // step 1 of google flow — launch popup, return supabase token to caller
  // caller then collects profile info and calls signUpWithGoogle or signInWithGoogle
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const redirectUri = Linking.createURL("/");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

        if (result.type === "success" && result.url) {
          const urlObj = new URL(result.url.replace("#", "?"));
          const supabaseToken = urlObj.searchParams.get("access_token");

          if (!supabaseToken) throw new Error("No token received from Google");

          // try login first — user might already exist
          try {
            const res = await api.post("/api/v1/auth/login/google", {
              supabaseAccessToken: supabaseToken,
            });
            setUser(res.data.data.user);
            return { error: null };
          } catch (loginErr: any) {
            // user not found — return token to caller so signup screen can collect profile
            if (loginErr.response?.status === 400) {
              return { error: null, supabaseToken };
            }
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
      const res = await api.post("/api/v1/auth/signup/google", data);
      setUser(res.data.data);
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
      await api.post("/api/v1/auth/logout");
    } catch (_) {
      // even if server call fails, clear local state
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signUpWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};