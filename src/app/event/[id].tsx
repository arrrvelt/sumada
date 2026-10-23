import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { supabase } from "@/lib/supabase";

type ContestantRow = { id: string; name: string };

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [eventName, setEventName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [contestants, setContestants] = useState<ContestantRow[]>([]);
  const [newContestant, setNewContestant] = useState("");

  async function loadEvent() {
    const { data, error } = await supabase
      .from("events")
      .select("name, room_code")
      .eq("id", id)
      .single();
    if (error) {
      Alert.alert("Could not load event", error.message);
      return;
    }
    setEventName(data.name);
    setRoomCode(data.room_code);
  }

  async function loadContestants() {
    const { data, error } = await supabase
      .from("contestants")
      .select("id, name")
      .eq("event_id", id);
    if (error) {
      Alert.alert("Could not load contestants", error.message);
      return;
    }
    setContestants(data ?? []);
  }

  async function addContestant() {
    if (newContestant.trim() === "") return;
    const { error } = await supabase
      .from("contestants")
      .insert({ event_id: id, name: newContestant.trim() });
    if (error) {
      Alert.alert("Could not add contestant", error.message);
      return;
    }
    setNewContestant("");
    loadContestants();
  }

  useFocusEffect(
    useCallback(() => {
      loadEvent();
      loadContestants();
    }, [id]),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: eventName }} />
      <ThemedText type="small">Room Code: {roomCode}</ThemedText>
      {contestants.map((c, index) => (
        <ThemedText key={c.id}>
          {index + 1}. {c.name}
        </ThemedText>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Contestant name"
        value={newContestant}
        onChangeText={setNewContestant}
      />
      <Button title="Add contestant" onPress={addContestant} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 12,
    color: "#888",
  },
});
