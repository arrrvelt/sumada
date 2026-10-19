import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { supabase } from "@/lib/supabase";

export default function SignInScreen() {
  // Blank 1 and 2: two pieces of state, both starting as empty strings
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Sign in failed", error.message);
    } else {
      Alert.alert("Signed in!");
    }
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert("Sign up failed", error.message);
    } else {
      Alert.alert("Signed up successfully!");
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title">Sumada</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign in" onPress={signIn} />
      <Button title="Create account" onPress={signUp} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  input: { borderWidth: 1, borderColor: "#888", borderRadius: 8, padding: 12, color: "#888" },
})