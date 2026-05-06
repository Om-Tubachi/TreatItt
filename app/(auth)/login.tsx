import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FormInput } from "../../components/ui/FormInput";
import { SubmitButton } from "../../components/ui/SubmitButton";
import { colors, radius, shadows, spacing, typography } from "../../constants/theme";
import { useAuth } from "../../context/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert("Error", "Please fill in both fields"); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert("Login Failed", error);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error, supabaseToken } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) { Alert.alert("Google Login Failed", error); return; }
    if (supabaseToken) router.push({ pathname: "/(auth)/signup", params: { supabaseToken } });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      {/* Top branding area */}
      <View style={styles.brandingArea}>
        <View style={styles.logoMark}>
          <Text style={styles.logoIcon}>♻</Text>
        </View>
        <Text style={styles.appName}>FRP Recycle</Text>
        <Text style={styles.appSub}>Industrial Waste Management</Text>

        {/* Geometric decoration */}
        <View style={styles.decoration}>
          <View style={[styles.decCircle, styles.dec1]} />
          <View style={[styles.decCircle, styles.dec2]} />
          <View style={[styles.decCircle, styles.dec3]} />
        </View>
      </View>

      {/* Form area */}
      <View style={styles.formArea}>
        <FormInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <SubmitButton
          label="Sign In →"
          loading={loading}
          onPress={handleLogin}
          disabled={loading || googleLoading}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.googleBtn, shadows.card]}
          onPress={handleGoogleLogin}
          disabled={loading || googleLoading}
          activeOpacity={0.8}
        >
          {googleLoading
            ? <ActivityIndicator color={colors.foreground} />
            : <Text style={styles.googleText}>Continue with Google</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupRow} onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, backgroundColor: colors.background },

  // Branding
  brandingArea: {
    backgroundColor: colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 48,
    overflow: "hidden",
  },
  logoMark: {
    width: 64, height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
    marginBottom: spacing[4],
    ...shadows.cardMd,
  },
  logoIcon: { fontSize: 32, color: colors.white },
  appName: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.surfaceDarkForeground,
    letterSpacing: 0.5,
  },
  appSub: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255,255,255,0.5)",
    marginTop: spacing[1],
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  decoration: { position: "absolute", width: "100%", height: "100%" },
  decCircle: { position: "absolute", borderRadius: 999, opacity: 0.06, backgroundColor: colors.primary },
  dec1: { width: 200, height: 200, top: -60, right: -60 },
  dec2: { width: 140, height: 140, bottom: -20, left: -40 },
  dec3: { width: 80, height: 80, top: 20, left: 40 },

  // Form
  formArea: {
    padding: spacing.screenPadding,
    gap: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: 48,
  },
  forgot: { alignSelf: "flex-end", marginTop: -spacing[2] },
  forgotText: { fontSize: typography.fontSize.sm, color: colors.primary },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: typography.fontSize.sm, color: colors.mutedForeground },
  googleBtn: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
  },
  googleText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.foreground,
  },
  signupRow: { alignItems: "center", marginTop: spacing[2] },
  signupText: { fontSize: typography.fontSize.sm, color: colors.mutedForeground },
  signupLink: { color: colors.primary, fontWeight: typography.fontWeight.semiBold },
});