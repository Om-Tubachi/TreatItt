import { useColorScheme } from "@/hooks/use-color-scheme";
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
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);

    if (error && error !== 'Sign in cancelled') {
      Alert.alert("Google Login Failed", error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor: isDark ? "#151718" : "#fff",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 32,
      color: isDark ? "#ECEDEE" : "#11181C",
      textAlign: "center",
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#ccc",
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      fontSize: 16,
      color: isDark ? "#ECEDEE" : "#11181C",
      backgroundColor: isDark ? "#232530" : "#f9f9f9",
    },
    button: {
      height: 50,
      backgroundColor: "#0a7ea4",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    googleButton: {
      flexDirection: "row",
      height: 50,
      backgroundColor: isDark ? "#232530" : "#fff",
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#ccc",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    googleButtonText: {
      color: isDark ? "#ECEDEE" : "#11181C",
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 12,
    },
    separatorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? "#3d3d3d" : "#ccc",
    },
    separatorText: {
      marginHorizontal: 10,
      color: isDark ? "#9ba1a6" : "#687076",
    },
    linkButton: {
      marginTop: 24,
      alignItems: "center",
    },
    linkText: {
      color: "#0a7ea4",
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={isDark ? "#9ba1a6" : "#687076"}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={isDark ? "#9ba1a6" : "#687076"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading || googleLoading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
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
          <ActivityIndicator color={isDark ? "#fff" : "#000"} />
        ) : (
          <>
            <Ionicons name="logo-google" size={24} color={isDark ? "#ECEDEE" : "#11181C"} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
