import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { supabase } from "@/lib/supabase";

type EventRow = { id: string; name: string; room_code: string };

export default function EventsScreen() {
  const [events, setEvents] = useState<EventRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      supabase
        .from("events")
        .select("id, name, room_code")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            Alert.alert("Could not load events", error.message);
            return;
          }
          setEvents(data ?? []);
        });
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title">Your events</ThemedText>
      <Button
        title="New event"
        onPress={() => router.navigate("/create-event")}
      />

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({ pathname: "/event/[id]", params: { id: item.id } })
            }
          >
            <ThemedText type="subtitle">{item.name}</ThemedText>
            <ThemedText type="small">Room code: {item.room_code}</ThemedText>
          </Pressable>
        )}
        ListEmptyComponent={
          <ThemedText>No events yet. Tap New event.</ThemedText>
        }
      />

      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#8884",
  },
});
