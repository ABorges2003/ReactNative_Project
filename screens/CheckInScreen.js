import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { CheckInBook } from "../service/LibraryService";
import {
  initUserTable,
  findUserByUsername,
  findUserByCC,
  dumpUsers,
} from "../database/userStore";

// Modes available for check-in: using UserID directly or looking up by CC
const MODES = { USER_ID: "USER_ID", CC_LOOKUP: "CC_LOOKUP" };

export default function CheckInScreen({ route }) {
  const { libraryId, book } = route.params;
  const [mode, setMode] = useState(MODES.USER_ID);
  const [userId, setUserId] = useState("");
  const [cc, setCC] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    initUserTable()
      .then(() =>
        dumpUsers().then((users) =>
          console.log(
            "📋 USERS_DUMP (CheckIn init):\n",
            JSON.stringify(users, null, 2)
          )
        )
      )
      .catch(() => {});
    AsyncStorage.getItem("userId").then((saved) => saved && setUserId(saved));
  }, []);

  // Resolve which username will be used based on selected mode
  const resolveUsername = async () => {
    if (mode === MODES.USER_ID) {
      if (!userId.trim()) throw new Error("Enter a User ID.");
      const u = await findUserByUsername(userId.trim());
      if (!u) throw new Error("User not found in local database.");
      return u.username;
    } else {
      if (!cc.trim()) throw new Error("Enter the Citizen Card (CC).");
      const u = await findUserByCC(cc.trim());
      if (!u) throw new Error("No user with that CC.");
      return u.username;
    }
  };

  const handleCheckIn = async () => {
    try {
      const username = await resolveUsername();
      await CheckInBook(libraryId, book.isbn, username);
      await AsyncStorage.setItem("userId", username);

      // Dump DB state after check-in
      await dumpUsers().then((users) =>
        console.log(
          "📋 USERS_DUMP (after CheckIn):\n",
          JSON.stringify(users, null, 2)
        )
      );

      Keyboard.dismiss();
      Alert.alert("Success", `${username} checked-in successfully.`);
      navigation.goBack();
    } catch (e) {
      console.error("Check-in error:", e);
      Alert.alert("Error", e?.message ?? "Failed to check in book.");
    }
  };

  const ModeChip = ({ label, value }) => (
    <TouchableOpacity
      onPress={() => setMode(value)}
      style={[styles.modeChip, mode === value && styles.modeChipActive]}
    >
      <Text style={mode === value ? styles.modeTextActive : styles.modeText}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/background.jpeg")}
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Check In Book</Text>

          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Choose input</Text>
            <View style={styles.modeRow}>
              <ModeChip label="1) User ID" value={MODES.USER_ID} />
              <ModeChip label="2) Existing CC" value={MODES.CC_LOOKUP} />
            </View>
          </View>

          {mode === MODES.USER_ID ? (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>User ID</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., UserClientPaulo1"
                value={userId}
                onChangeText={setUserId}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />
            </View>
          ) : (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Citizen Card (CC)</Text>
              <TextInput
                style={styles.input}
                placeholder="CC"
                value={cc}
                onChangeText={setCC}
                keyboardType="number-pad"
                placeholderTextColor="#aaa"
              />
            </View>
          )}

          <Button title="Done" onPress={handleCheckIn} color="#007BFF" />
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  block: { marginBottom: 18 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  modeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  modeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modeChipActive: { backgroundColor: "#fff" },
  modeText: { color: "#fff" },
  modeTextActive: { color: "#000", fontWeight: "600" },
});
