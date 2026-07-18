import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import { AppText } from '../atoms/AppText';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';

interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSubmit: () => Promise<void>;
  loading: boolean;
  gLoading: boolean;
}

export function SignInForm({ onSubmit, onGoogleSubmit, loading, gLoading }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitting = () => {
    if (!validate()) return;
    onSubmit(email, password);
  };

  const anyLoading = loading || gLoading;

  return (
    <View style={styles.container}>
      {/* Form Fields Block */}
      <View style={styles.formFields}>
        <FormField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={t => { setEmail(t); setErrors(p => ({ ...p, email: undefined })); }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <FormField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={t => { setPassword(t); setErrors(p => ({ ...p, password: undefined })); }}
          secureToggle
          error={errors.password}
        />
      </View>

      {/* Main Form Submitter */}
      <Button
        label="Continue"
        onPress={handleSubmitting}
        loading={loading}
        disabled={anyLoading}
      />

      {/* Visual Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <AppText variant="caption">OR</AppText>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Handlers */}
      <Button
        label="Continue with Google"
        variant="outlined"
        onPress={onGoogleSubmit}
        loading={gLoading}
        disabled={anyLoading}
      />
      <Button
        label="Forgot password"
        variant="outlined"
        onPress={() => router.push(`/(auth)/forgot-password`)}
        
      />

      {/* Redirection Links Footer */}
      <View style={styles.footer}>
        <AppText variant="caption">Dont have an account? </AppText>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <AppText variant="caption" style={styles.link}>Create account</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  formFields: { 
    gap: 16, 
    width: '100%', 
    alignItems: 'center' 
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  footer: { 
    flexDirection: 'row', 
    marginTop: 4 
  },
  link: { 
    color: colors.primaryDark, 
    fontWeight: '600' 
  },
});