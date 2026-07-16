import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { useIndustries } from "../../hooks/useIndustries";

const TOTAL_STEPS = 3;

function SignupScreen() {
    const router = useRouter();
    const { supabaseToken } = useLocalSearchParams<{ supabaseToken?: string }>();
    const isGoogle = !!supabaseToken;

    const { signUp, signInWithGoogle } = useAuth();
    const { data: industries = [], isLoading: industriesLoading } = useIndustries();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1 — identity
    const [fname, setFname] = useState('');
    const [mname, setMname] = useState('');
    const [lname, setLname] = useState('');
    const [username, setUsername] = useState('');

    // Step 2 — professional
    const [companyName, setCompanyName] = useState('');
    const [designation, setDesignation] = useState('');
    const [frpIndustryId, setIndustryId] = useState('');
    const [address, setAddress] = useState('');

    // Step 3 — credentials
    const [email, setEmail] = useState('');
    const [contactNum, setContactNum] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const validateStep = () => {
        if (step === 1) {
            if (!fname.trim() || !lname.trim() || !username.trim()) {
                Alert.alert('Required', 'First name, last name and username are required');
                return false;
            }
        }
        if (step === 2) {
            if (!frpIndustryId) {
                Alert.alert('Required', 'Please select your industry');
                return false;
            }
        }
        if (step === 3) {
            if (!email.trim()) {
                Alert.alert('Required', 'Email is required');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (step < TOTAL_STEPS) { setStep(s => s + 1); return; }
        
        handlePasswordSubmit();
    };

    const handlePasswordSubmit = async () => {
        if (!password.trim()) {
            Alert.alert('Required', 'Password is required');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Mismatch', 'Passwords do not match');
            return;
        }

        setLoading(true);
        const payload = {
            username, fname, mname, lname,
            companyName, designation, frpIndustryId,
            address, email, contactNum, password
        };

        const { error } = await signUp(payload);
        setLoading(false);
        if (error) { Alert.alert('Signup Failed', error); return; }
        router.replace('/(tabs)');
    };

    const handleGoogleSignup = async () => {
        if (!validateStep()) return;
        setLoading(true);

        const payload = {
            username,
            fname,
            mname,
            lname,
            companyName,
            designation,
            frpIndustryId,
            address,
            email,
            contactNum,
        };

        const { error } = await signInWithGoogle(payload);
        
        setLoading(false);
        if (error) { Alert.alert('Google Signup Failed', error); return; }
        router.replace('/(tabs)');
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>FRP Recycle</Text>
            <Text style={styles.subtitle}>Create your account</Text>

            {/* Step indicator */}
            <View style={styles.stepRow}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <View key={i} style={[styles.stepDot, i + 1 <= step && styles.stepDotActive]} />
                ))}
            </View>

            {step === 1 && (
                <View style={styles.stepContainer}>
                    <Text style={step === 1 ? styles.stepTitle : styles.label}>Who are you?</Text>
                    <TextInput style={styles.input} placeholder="First name *" placeholderTextColor="#9ba1a6" value={fname} onChangeText={setFname} />
                    <TextInput style={styles.input} placeholder="Middle name" placeholderTextColor="#9ba1a6" value={mname} onChangeText={setMname} />
                    <TextInput style={styles.input} placeholder="Last name *" placeholderTextColor="#9ba1a6" value={lname} onChangeText={setLname} />
                    <TextInput style={styles.input} placeholder="Username *" placeholderTextColor="#9ba1a6" value={username} onChangeText={setUsername} autoCapitalize="none" />
                </View>
            )}

            {step === 2 && (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Your work</Text>
                    <TextInput style={styles.input} placeholder="Company name" placeholderTextColor="#9ba1a6" value={companyName} onChangeText={setCompanyName} />
                    <TextInput style={styles.input} placeholder="Designation" placeholderTextColor="#9ba1a6" value={designation} onChangeText={setDesignation} />
                    <TextInput style={styles.input} placeholder="Address" placeholderTextColor="#9ba1a6" value={address} onChangeText={setAddress} multiline />

                    <Text style={styles.label}>Industry *</Text>
                    {industriesLoading ? (
                        <ActivityIndicator style={{ marginVertical: 12 }} />
                    ) : (
                        <View style={styles.pickerWrap}>
                            <Picker selectedValue={frpIndustryId} onValueChange={setIndustryId}>
                                <Picker.Item label="Select industry..." value="" />
                                {industries.map((ind: { id: string; industry_name: string }) => (
                                    <Picker.Item key={ind.id} label={ind.industry_name} value={ind.id} />
                                ))}
                            </Picker>
                        </View>
                    )}
                </View>
            )}

            {step === 3 && (
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Credentials</Text>
                    <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#9ba1a6" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                    <TextInput style={styles.input} placeholder="Contact number" placeholderTextColor="#9ba1a6" value={contactNum} onChangeText={setContactNum} keyboardType="phone-pad" />
                    
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Sign Up with Password</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TextInput style={styles.input} placeholder="Password *" placeholderTextColor="#9ba1a6" value={password} onChangeText={setPassword} secureTextEntry />
                    <TextInput style={styles.input} placeholder="Confirm password *" placeholderTextColor="#9ba1a6" value={confirm} onChangeText={setConfirm} secureTextEntry />
                    
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or Use Google</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity 
                        style={styles.googleBtn} 
                        onPress={handleGoogleSignup}
                        disabled={loading}
                    >
                        <Text style={styles.googleBtnText}>Sign up with Google</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.navRow}>
                {step > 1 && (
                    <TouchableOpacity style={styles.backBtn} onPress={() => setStep(s => s - 1)}>
                        <Text style={styles.backBtnText}>← Back</Text>
                    </TouchableOpacity>
                )}
                
                {!(step === TOTAL_STEPS) && (
                    <TouchableOpacity
                        style={[styles.nextBtn, step === 1 && styles.nextBtnFull]}
                        onPress={handleNext}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.nextBtnText}>Next →</Text>
                        )}
                    </TouchableOpacity>
                )}

                {step === TOTAL_STEPS && (
                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={handlePasswordSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.nextBtnText}>Register with Password</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/sign-in')}>
                <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginBold}>Sign In</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#11181C', textAlign: 'center', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#687076', textAlign: 'center', marginBottom: 24 },
    stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
    stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e0e0e0' },
    stepDotActive: { backgroundColor: '#2ecc71' },
    stepContainer: { gap: 12, marginBottom: 24 },
    stepTitle: { fontSize: 18, fontWeight: '600', color: '#11181C', marginBottom: 4 },
    label: { fontSize: 13, color: '#687076', marginTop: 4 },
    input: {
        height: 50, borderWidth: 1, borderColor: '#e0e0e0',
        borderRadius: 10, paddingHorizontal: 16, fontSize: 16,
        color: '#11181C', backgroundColor: '#f9f9f9',
    },
    pickerWrap: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, overflow: 'hidden', backgroundColor: '#f9f9f9' },
    navRow: { flexDirection: 'row', gap: 12 },
    backBtn: { flex: 1, height: 50, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    backBtnText: { fontSize: 15, color: '#687076' },
    nextBtn: { flex: 1, height: 50, backgroundColor: '#2ecc71', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    nextBtnFull: { flex: 1 },
    nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    loginLink: { marginTop: 24, alignItems: 'center' },
    loginText: { color: '#687076', fontSize: 14 },
    loginBold: { color: '#2ecc71', fontWeight: '600' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
    dividerText: { fontSize: 12, color: '#9ba1a6', marginHorizontal: 10 },
    googleBtn: {
        height: 50,
        backgroundColor: '#4285F4',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default SignupScreen;