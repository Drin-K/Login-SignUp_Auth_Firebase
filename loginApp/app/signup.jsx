import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";

// Importo Auth nga Firebase për React Native
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase"; // marrim instancën e app-it që e inicializon Firebase

export default function SignupScreen() {
  const router = useRouter();
  const auth = getAuth(app); // krijo instancën e auth për këtë app

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Sign Up" onPress={handleSignup} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Link href="/login" style={styles.link}>
        Already have an account? Log in
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
