import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function EventsScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}
    >
      <ThemedText type="title">Your events</ThemedText>
      <Button title="New event" onPress={() => router.push("/create-event")} />
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}
