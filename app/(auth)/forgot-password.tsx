import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useForgotPassword, useResetPassword } from '../../hooks/useUsers';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { mutateAsync: checkEmail, isPending: checking } = useForgotPassword();
    const { mutateAsync: doReset, isPending: resetting } = useResetPassword();

    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleCheckEmail = async () => {
        if (!email.trim()) { Alert.alert('Required', 'Enter your email'); return; }
        try {
            await checkEmail(email.trim());
            setStep(2);
        } catch (e: any) {
            Alert.alert('Not Found', e.response?.data?.message || 'No account found with this email');
        }
    };

    const handleReset = async () => {
        if (!newPassword) { Alert.alert('Required', 'Enter a new password'); return; }
        if (newPassword !== confirm) { Alert.alert('Mismatch', 'Passwords do not match'); return; }
        try {
            await doReset({ email: email.trim(), newPassword });
            Alert.alert('Success', 'Password reset. Please sign in.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }
            ]);
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>

            {step === 1 && (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Enter your account email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#9ba1a6"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleCheckEmail} disabled={checking}>
                        {checking ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue</Text>}
                    </TouchableOpacity>
                </View>
            )}

            {step === 2 && (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Set a new password for {email}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New password"
                        placeholderTextColor="#9ba1a6"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        placeholderTextColor="#9ba1a6"
                        value={confirm}
                        onChangeText={setConfirm}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleReset} disabled={resetting}>
                        {resetting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Reset Password</Text>}
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
                <Text style={styles.backLinkText}>← Back to sign in</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#11181C', textAlign: 'center', marginBottom: 24 },
    stepContainer: { gap: 12 },
    label: { fontSize: 14, color: '#687076', marginBottom: 4 },
    input: { height: 50, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 16, fontSize: 16, color: '#11181C', backgroundColor: '#f9f9f9' },
    btn: { height: 50, backgroundColor: '#2ecc71', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    backLink: { marginTop: 24, alignItems: 'center' },
    backLinkText: { color: '#687076', fontSize: 14 },
});