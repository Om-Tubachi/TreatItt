import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert("Login Failed", error);
    // no redirect — AuthGate handles it
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error, supabaseToken } = await signInWithGoogle();
    setGoogleLoading(false);

    if (error) {
      Alert.alert("Google Login Failed", error);
      return;
    }

    if (supabaseToken) {
      // user doesn't exist yet, carry token to signup
      router.push({ pathname: "/(auth)/signup", params: { supabaseToken } });
    }
    // no token + no error = login succeeded, AuthGate redirects
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FRP Recycle</Text>
      <Text style={styles.subtitle}>Industrial Waste Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#9ba1a6"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9ba1a6"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading || googleLoading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In →</Text>
        )}
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleLogin}
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#11181C",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#687076",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#11181C",
    backgroundColor: "#f9f9f9",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#2ecc71",
    fontSize: 14,
  },
  button: {
    height: 50,
    backgroundColor: "#2ecc71",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#687076",
    fontSize: 13,
  },
  googleButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  googleButtonText: {
    color: "#11181C",
    fontSize: 16,
    fontWeight: "500",
  },
  signupLink: {
    marginTop: 24,
    alignItems: "center",
  },
  signupText: {
    color: "#687076",
    fontSize: 14,
  },
  signupBold: {
    color: "#2ecc71",
    fontWeight: "600",
  },
});