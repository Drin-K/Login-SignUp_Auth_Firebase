import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../firebase";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ================================
  // 📧 LOGIN ME EMAIL & PASSWORD
  // ================================
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  // ================================
  // 🌐 LOGIN ME GOOGLE (Expo SDK 54+)
  // ================================
 const redirectUri = "https://auth.expo.io/@drin-k/loginApp";
  console.log("🔍 [Google Redirect URI]:", redirectUri);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: "500331822653-tlrct74836jefk8b08a99altfsirc132.apps.googleusercontent.com",
    webClientId: "500331822653-tlrct74836jefk8b08a99altfsirc132.apps.googleusercontent.com",
    iosClientId: "500331822653-tlrct74836jefk8b08a99altfsirc132.apps.googleusercontent.com",
    redirectUri, // 👈 kjo është thelbësore për të shmangur “invalid_request”
  });

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace("/home"))
        .catch((err) => setError(err.message));
    }
  }, [googleResponse]);

  // Opsionale — për të parë redirect-in në terminal
  useEffect(() => {
    console.log("✅ Redirect URI in use:", redirectUri);
  }, []);

  // ================================
  // 🐙 LOGIN ME GITHUB (demo mode)
  // ================================
  const GITHUB_CLIENT_ID = "Ov23liKRI3UNokX0DcG0"; // vendos Client ID nga GitHub Developer Settings

  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
  };

  const [githubRequest, githubResponse, githubPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (githubResponse?.type === "success") {
      console.log("✅ GitHub login success:", githubResponse);
      Alert.alert("GitHub Login", "Autorizimi u krye me sukses (demo mode).");
    }
  }, [githubResponse]);

  // ================================
  // 🖥️ UI
  // ================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginVertical: 10 }} />
      <Button
        title="Login me Google"
        onPress={() => googlePromptAsync()}
        color="#DB4437"
        disabled={!googleRequest}
      />
      <View style={{ marginVertical: 10 }} />
      <Button
        title="Login me GitHub"
        onPress={() => githubPromptAsync()}
        color="#333"
        disabled={!githubRequest}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Link href="/signup" style={styles.link}>
        Don’t have an account? Sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  error: { color: "red", marginTop: 10 },
  link: { color: "blue", marginTop: 20 },
});
