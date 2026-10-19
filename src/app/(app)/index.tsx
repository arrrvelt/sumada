import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { supabase } from "@/lib/supabase";

export default function EventsScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}
    >
      <ThemedText type="title">Your events</ThemedText>
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </SafeAreaView>
  );
}
