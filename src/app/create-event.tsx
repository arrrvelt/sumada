import { ThemedText } from "@/components/themed-text";
import { generateRoomCode } from "@/lib/room-code";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function createEvent() {
    if (name.trim() === "") {
      Alert.alert("Give your event a name");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("events")
      .insert({ name: name.trim(), room_code: generateRoomCode() });
    setSaving(false);

    if (error) {
      Alert.alert("Could not create event", error.message);
      return;
    }
    router.back();
  }

  return (
    <View style={styles.container}>
      <ThemedText>Event name</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mr. & Ms. Intramurals 2026"
        value={name}
        onChangeText={setName}
      />
      <Button
        title={saving ? "Creating..." : "Create event"}
        onPress={createEvent}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    padding: 12,
    color: "#888",
  },
});
