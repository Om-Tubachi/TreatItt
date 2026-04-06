import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function GoogleSignInButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    setIsSigningIn(true);
    setErrorMsg("");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      // Safe assignment across different react-native-google-signin versions
      const idToken = userInfo.data ? userInfo.data.idToken : userInfo.idToken;

      if (!idToken) {
        throw new Error("No ID token found from Google Authentication.");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error: any) {
      console.error("Google SignIn Error:", error);
      setErrorMsg(error.message || "Google Auth Failed");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isSigningIn ? "Signing in..." : "Sign in with Google"}
        onPress={signIn}
        disabled={isSigningIn}
      />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  error: {
    color: "red",
    marginTop: 8,
    fontSize: 12,
  },
});
