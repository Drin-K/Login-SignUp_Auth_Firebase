import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithCredential, GithubAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth(app);
  const [error, setError] = useState("");

  // ================================
  // ⚙️ GITHUB LOGIN (REAL IMPLEMENTATION)
  // ================================
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  console.log("🔍 [GitHub Redirect URI]:", redirectUri);

  const GITHUB_CLIENT_ID = "Ov23liKRI3UNokX0DcG0"; // nga GitHub Developer Settings
  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri,
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    const handleGitHubAuth = async () => {
      if (response?.type === "success" && response.params.code) {
        const { code } = response.params;
        console.log("✅ GitHub authorization code:", code);

        try {
          // Thirr backend-in për të shkëmbyer 'code' me 'access_token'
          const res = await fetch("http://10.180.57.66:3000/exchange_github_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          const data = await res.json();
          console.log("🔑 Access token response:", data);

          if (data.access_token) {
            const credential = GithubAuthProvider.credential(data.access_token);
            await signInWithCredential(auth, credential);
            router.replace("/home");
          } else {
            Alert.alert("Gabim", "Nuk u mor access_token nga backend!");
          }
        } catch (error) {
          console.error(error);
          setError("Dështoi login-i me GitHub.");
        }
      }
    };

    handleGitHubAuth();
  }, [response]);

  // ================================
  // 🖥️ UI
  // ================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login me GitHub</Text>

      <Button
        title="Login me GitHub"
        onPress={() => promptAsync()}
        color="#333"
        disabled={!request}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 25 },
  error: { color: "red", marginTop: 10 },
});
