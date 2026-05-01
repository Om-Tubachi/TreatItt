import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/auth';

const Me = () => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Field label="Username" value={user?.username} />
      <Field label="First Name" value={user?.first_name} />
      <Field label="Middle Name" value={user?.middle_name} />
      <Field label="Last Name" value={user?.last_name} />
      <Field label="Email" value={user?.email} />
      <Field label="Company" value={user?.company_name} />
      <Field label="Designation" value={user?.designation} />
      <Field label="Contact" value={user?.contact_number} />
      <Field label="Address" value={user?.address} />
      <Field label="Verified" value={user?.is_verified ? 'Yes' : 'No'} />
    </ScrollView>
  );
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '—'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  field: { marginBottom: 12 },
  label: { fontSize: 12, color: '#888' },
  value: { fontSize: 16 },
});

export default Me;