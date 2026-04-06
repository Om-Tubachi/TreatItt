import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// This is required for the browser-based OAuth flow to redirect back correctly
WebBrowser.maybeCompleteAuthSession();

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapSupabaseUser = (sbUser: SupabaseUser | null): User | null => {
    if (!sbUser) return null;
    return {
      id: sbUser.id,
      email: sbUser.email || "",
      fullName:
        sbUser.user_metadata?.fullName || sbUser.user_metadata?.full_name,
      companyName: sbUser.user_metadata?.companyName,
      designation: sbUser.user_metadata?.designation,
      username: sbUser.user_metadata?.username,
      mobileNo: sbUser.user_metadata?.mobileNo,
      industrySector: sbUser.user_metadata?.industrySector,
    };
  };

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("--- AUTH STATE CHANGE ---", _event);
      setSession(session);
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    return { error: error?.message || null };
  };

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    const { email, password, ...metadata } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password: password!,
      options: {
        data: metadata,
      },
    });
    setIsLoading(false);
    return { error: error?.message || null };
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // We try two different types of redirect URIs to see which one works best
      const redirectUri = Linking.createURL("/");

      console.log("--- GOOGLE LOGIN ATTEMPT ---");
      console.log("Using Redirect URI:", redirectUri);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        console.log("Full Google Auth URL:", data.url);
        console.log("Waiting for browser response...");

        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri,
        );

        console.log("Browser closed with result:", result.type);

        if (result.type === "success" && result.url) {
          console.log("Success! Redirect URL received:", result.url);

          const urlObj = new URL(result.url.replace("#", "?"));
          const access_token = urlObj.searchParams.get("access_token");
          const refresh_token = urlObj.searchParams.get("refresh_token");

          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) console.error("Session error:", sessionError);
            else console.log("Login Complete!");
          }
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      return { error: error.message || "An unknown error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    const {
      error,
      data: { user: updatedUser },
    } = await supabase.auth.updateUser({
      data: data,
    });
    if (!error && updatedUser) {
      setUser(mapSupabaseUser(updatedUser));
    }
    setIsLoading(false);
    return { error: error?.message || null };
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
