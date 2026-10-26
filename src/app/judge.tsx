import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { supabase } from "@/lib/supabase";

type JudgeInfo = { id: string; name: string; events: { name: string } | null };

export default function JudgeScreen() {
  const [judge, setJudge] = useState<JudgeInfo | null>(null);
  const [code, setCode] = useState("");

  async function loadJudge() {
    const { data, error } = await supabase
      .from("judges")
      .select("id, name, events(name)")
      .maybeSingle();
    if (error) {
      Alert.alert("Could not load your judge info", error.message);
      return;
    }
    setJudge(data as JudgeInfo | null);
  }

  async function claimCode() {
    const { error } = await supabase.rpc("claim_judge", {
      code: code.trim().toUpperCase(),
    });
    if (error) {
      Alert.alert("Could not join", error.message);
      return;
    }
    setCode("");
    loadJudge();
  }

  useFocusEffect(
    useCallback(() => {
      loadJudge();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {judge ? (
        <>
          <ThemedText type="title">Hi, {judge.name}!</ThemedText>
          <ThemedText>You're judging {judge.events?.name}.</ThemedText>
          <ThemedText type="small">
            Your scoresheet comes in the next step.
          </ThemedText>
        </>
      ) : (
        <>
          <ThemedText type="title">Enter your judge code</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="e.g. K7PX2M"
            autoCapitalize="characters"
            value={code}
            onChangeText={setCode}
          />
          <Button title="Join" onPress={claimCode} />
        </>
      )}
      <Button title="Leave" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 12,
    color: "#888",
    fontSize: 20,
    letterSpacing: 4,
  },
});
