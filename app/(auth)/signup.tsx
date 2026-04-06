import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [industrySector, setIndustrySector] = useState('');

  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !fullName || !username) {
      Alert.alert('Error', 'Please fill in all the required fields (Full Name, Username, Email, Password)');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await signUp({
      email,
      password,
      fullName,
      companyName,
      designation,
      username,
      mobileNo,
      industrySector
    });
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error);
    } else {
      Alert.alert('Success', 'Account created! Please sign in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#151718' : '#fff',
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 32,
      color: isDark ? '#ECEDEE' : '#11181C',
      textAlign: 'center',
      marginTop: 40,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: isDark ? '#3d3d3d' : '#ccc',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      fontSize: 16,
      color: isDark ? '#ECEDEE' : '#11181C',
      backgroundColor: isDark ? '#232530' : '#f9f9f9',
    },
    button: {
      height: 50,
      backgroundColor: '#0a7ea4',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    linkButton: {
      marginTop: 24,
      alignItems: 'center',
      marginBottom: 40,
    },
    linkText: {
      color: '#0a7ea4',
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Username *"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Mobile No"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Company Name"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={companyName}
          onChangeText={setCompanyName}
        />

        <TextInput
          style={styles.input}
          placeholder="Designation"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={designation}
          onChangeText={setDesignation}
        />

        <TextInput
          style={styles.input}
          placeholder="Industry Sector"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={industrySector}
          onChangeText={setIndustrySector}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
