import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { generateRoomCode } from "@/lib/room-code";
import { supabase } from "@/lib/supabase";

type ContestantRow = { id: string; name: string };
type CriterionRow = { id: string; name: string; weight: number; max: number };
type JudgeRow = {
  id: string;
  name: string;
  join_code: string;
  user_id: string | null;
};

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [eventName, setEventName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [contestants, setContestants] = useState<ContestantRow[]>([]);
  const [newContestant, setNewContestant] = useState("");
  const [criteria, setCriteria] = useState<CriterionRow[]>([]);
  const [newCriterion, setNewCriterion] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newMax, setNewMax] = useState("");
  const [judges, setJudges] = useState<JudgeRow[]>([]);
  const [newJudge, setNewJudge] = useState("");

  let totalWeight = 0;
  for (const c of criteria) {
    totalWeight += c.weight;
  }

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

  async function loadCriteria() {
    const { data, error } = await supabase
      .from("criteria")
      .select("id, name, weight, max")
      .eq("event_id", id);
    if (error) {
      Alert.alert("Could not load criteria", error.message);
      return;
    }
    setCriteria(data ?? []);
  }

  async function addCriterion() {
    const weight = Number(newWeight);
    const max = Number(newMax);

    if (
      newCriterion.trim() === "" ||
      Number.isNaN(weight) ||
      Number.isNaN(max) ||
      weight <= 0 ||
      max <= 0
    ) {
      Alert.alert(
        "Check the criterion",
        "Give it a name, and a weight and max above 0.",
      );
      return;
    }

    if (totalWeight + weight > 100) {
      Alert.alert("Too much weight", `Only ${100 - totalWeight} left`);
      return;
    }

    const { error } = await supabase.from("criteria").insert({
      event_id: id,
      name: newCriterion.trim(),
      weight: newWeight.trim(),
      max: newMax.trim(),
    });
    if (error) {
      Alert.alert("Could not add criterion", error.message);
      return;
    }
    setNewCriterion("");
    setNewWeight("");
    setNewMax("");
    loadCriteria();
  }

  async function loadJudges() {
    const { data, error } = await supabase
      .from("judges")
      .select("id, name, join_code, user_id")
      .eq("event_id", id);
    if (error) {
      Alert.alert("Could not load judges", error.message);
      return;
    }
    setJudges(data ?? []);
  }

  async function addJudge() {
    if (newJudge.trim() === "") return;

    for (let attempt = 1; attempt <= 5; attempt++) {
      const { error } = await supabase.from("judges").insert({
        event_id: id,
        name: newJudge.trim(),
        join_code: generateRoomCode(),
      });

      if (!error) {
        setNewJudge("");
        loadJudges();
        return;
      }

      if (error.code !== "23505") {
        Alert.alert("Could not add judge", error.message);
        return;
      }
    }

    Alert.alert(
      "Could not add judge",
      "Couldn't find a free code. Please try again.",
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadEvent();
      loadContestants();
      loadCriteria();
      loadJudges();
    }, [id]),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: eventName }} />
      <ThemedText type="small">Room Code: {roomCode}</ThemedText>
      <ThemedText type="subtitle">Criteria</ThemedText>
      {criteria.map((c) => (
        <ThemedText key={c.id}>
          {c.name}: {c.weight}% (out of {c.max})
        </ThemedText>
      ))}
      <ThemedText type="small">
        Total weight: {totalWeight}%
        {totalWeight === 100 ? "✓" : "(must reach 100%)"}
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Criterion name (e.g. Talent)"
        value={newCriterion}
        onChangeText={setNewCriterion}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight % (e.g. 40)"
        keyboardType="numeric"
        value={newWeight}
        onChangeText={setNewWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Max score (e.g. 10)"
        keyboardType="numeric"
        value={newMax}
        onChangeText={setNewMax}
      />
      <Button title="Add criterion" onPress={addCriterion} />
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
      <ThemedText type="subtitle">Judges</ThemedText>
      {judges.map((j) => (
        <ThemedText key={j.id} selectable>
          {j.name}: {j.join_code} {j.user_id ? "✓ joined" : "(not joined yet)"}
        </ThemedText>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Judge name"
        value={newJudge}
        onChangeText={setNewJudge}
      />
      <Button title="Add judge" onPress={addJudge} />
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
