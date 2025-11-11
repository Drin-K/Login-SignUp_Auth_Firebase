import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  GithubAuthProvider,
} from "firebase/auth";
import { app } from "../firebase";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 Login with Email/Password
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  // 🔹 GitHub Login setup
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const GITHUB_CLIENT_ID = "Ov23liKRI3UNokX0DcG0";

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
          const res = await fetch("http://10.180.57.66:3000/exchange_github_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          const data = await res.json();

          if (data.access_token) {
            const credential = GithubAuthProvider.credential(data.access_token);
            await signInWithCredential(auth, credential);
            console.log("✅ GitHub login successful");
            setTimeout(() => router.replace("/home"), 500);
          } else {
            Alert.alert("Error", "Failed to retrieve access token from backend.");
          }
        } catch (error) {
          console.error(error);
          setError("GitHub login failed.");
        }
      }
    };

    handleGitHubAuth();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In to Your Account</Text>

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

      <Button title="Log In with Email" onPress={handleEmailLogin} />

      <Text style={{ marginVertical: 20, fontWeight: "600" }}>or</Text>

      <Button
        title="Log In with GitHub"
        onPress={() => promptAsync()}
        color="#333"
        disabled={!request}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  error: { color: "red", marginTop: 10 },
  link: {
    color: "#007bff",
    marginTop: 25,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
