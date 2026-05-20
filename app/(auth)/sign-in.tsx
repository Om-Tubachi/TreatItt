import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { AuthScreenLayout } from '../../components/layout/AuthScreenLayout';
import { SignInForm } from '../../components/organisms/SigninForm';
import { useAuth } from '../../context/auth';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert('Login Failed', error);
  };

  const handleGoogleSignIn = async () => {
    setGLoading(true);
    const { error, supabaseToken } = await signInWithGoogle();
    setGLoading(false);
    
    if (error) { 
      Alert.alert('Google Login Failed', error); 
      return; 
    }
    if (supabaseToken) {
      router.push({ pathname: '/(auth)/signup', params: { supabaseToken } });
    }
  };

  return (
    <AuthScreenLayout title="Sign In">
      <SignInForm 
        onSubmit={handleSignIn}
        onGoogleSubmit={handleGoogleSignIn}
        loading={loading}
        gLoading={gLoading}
      />
    </AuthScreenLayout>
  );
}