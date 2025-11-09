import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// ✅ Importet për React Native Firebase SDK
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase";

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth(app); // krijo instancën e auth për këtë app

  const [userEmail, setUserEmail] = useState("");

  // 🧠 Kontrollo statusin e përdoruesit (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.replace("/login");
      }
    });
    return unsubscribe; // çaktivizon listener-in kur komponenti mbyllet
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.email}>{userEmail}</Text>

      <Button title="Logout" onPress={handleLogout} color="#E53935" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  email: { fontSize: 18, marginBottom: 30, color: "gray" },
});
