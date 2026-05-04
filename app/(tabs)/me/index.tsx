import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/auth';

const Me = () => {
    const { user } = useAuth();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.detailBox}>
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
            </View>

            <TouchableOpacity style={styles.resourcesBtn} onPress={() => router.push('/screens/resources')}>
                <Text style={styles.resourcesBtnText}>resources</Text>
            </TouchableOpacity>
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
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    detailBox: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, gap: 8, marginBottom: 16 },
    field: { marginBottom: 8 },
    label: { fontSize: 12, color: '#888' },
    value: { fontSize: 16 },
    resourcesBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 14, alignItems: 'center', backgroundColor: '#000' },
    resourcesBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default Me;