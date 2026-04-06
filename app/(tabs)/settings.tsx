import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const { user, updateProfile, signOut } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [mobileNo, setMobileNo] = useState(user?.mobileNo || '');
  const [industrySector, setIndustrySector] = useState(user?.industrySector || '');

  const [loading, setLoading] = useState(false);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      fullName,
      companyName,
      designation,
      mobileNo,
      industrySector
    });
    setLoading(false);

    if (error) {
      Alert.alert('Update Failed', error);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e: any) {
      Alert.alert('Logout Error', e.message);
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: isDark ? '#ECEDEE' : '#11181C',
    },
    readonlyInput: {
      height: 50,
      borderWidth: 1,
      borderColor: isDark ? '#3d3d3d' : '#ccc',
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      fontSize: 16,
      color: isDark ? '#888' : '#888',
      backgroundColor: isDark ? '#1e1e1e' : '#eee',
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
      marginBottom: 24,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    logoutButton: {
      height: 50,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#ff3b30',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    logoutButtonText: {
      color: '#ff3b30',
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Essential Details (Read-only)</Text>
        <TextInput
          style={styles.readonlyInput}
          value={user?.username}
          editable={false}
        />
        <TextInput
          style={styles.readonlyInput}
          value={user?.email}
          editable={false}
        />

        <Text style={styles.sectionTitle}>Profile Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={isDark ? '#9ba1a6' : '#687076'}
          value={fullName}
          onChangeText={setFullName}
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

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
