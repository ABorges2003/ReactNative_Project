import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckOutBook } from "../service/LibraryService";

import {
  findUserByCC,
  findUserByUsername,
  createUser,
  dumpUsers,
  initUserTable,
} from "../database/userStore";

const ROLES = ["Client", "Librarian", "Admin"];
const MODES = {
  USER_ID: "USER_ID",
  CC_LOOKUP: "CC_LOOKUP",
  CREATE_USER: "CREATE_USER",
};

const CheckOutScreen = ({ route }) => {
  const { libraryId, book } = route.params;

  const [mode, setMode] = useState(MODES.USER_ID);

  const [userId, setUserId] = useState(""); 
  const [cc, setCC] = useState(""); 
  const [firstName, setFirstName] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [role, setRole] = useState("Client"); 

  const [checkoutData, setCheckoutData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    initUserTable().catch((e) => console.warn("initUserTable error:", e));
    AsyncStorage.getItem("userId").then((stored) => {
      if (stored) setUserId(stored);
    });
    //Auto dump on open (appears on PC/Metro)
    (async () => {
      try {
        await dumpUsers();
      } catch (e) {
        console.warn("dumpUsers on mount error:", e?.message);
      }
    })();
  }, []);

  const saveUserId = async (id) => {
    try {
      await AsyncStorage.setItem("userId", id);
    } catch (e) {
      console.error("Failed to save user ID:", e);
    }
  };

  // function responsible for returning a valid username according to the mode
  const resolveUsername = async () => {
    if (mode === MODES.USER_ID) {
      if (!userId.trim()) throw new Error("Enter a User ID.");
      const u = await findUserByUsername(userId.trim());
      if (!u) throw new Error("User ID not found in database.");
      return u.username;
    }

    if (mode === MODES.CC_LOOKUP) {
      if (!cc.trim()) throw new Error("Indicate the Citizen Card (CC).");
      const u = await findUserByCC(cc.trim());
      if (!u) throw new Error("There is no user with that CC.");
      return u.username;
    }

    // MODES.CREATE_USER
    if (!cc.trim() || !firstName.trim() || !phone.trim()) {
      throw new Error("Enter CC, First Name and Phone to create the user.");
    }
    // If CC already exists, use the existing one; otherwise, create it
    const existing = await findUserByCC(cc.trim());
    if (existing) return existing.username;

    const newUser = await createUser({
      cc: cc.trim(),
      firstName: firstName.trim(),
      phone: phone.trim(),
      role,
    });
    return newUser.username;
  };

  const handleCheckout = async () => {
    try {
      const username = await resolveUsername();

      const response = await CheckOutBook(libraryId, book.isbn, username);
      const { id, dueDate, book: responseBook } = response.data;
      setCheckoutData({ id, isbn: responseBook.isbn, dueDate });

      await saveUserId(username);

      // Automatic post-checkout dump to see if the user was successfully inserted into the database
      await dumpUsers();

      Keyboard.dismiss();
      Alert.alert("Success", "Book successfully checked out.");
    } catch (err) {
      console.error("Checkout error:", err);
      Alert.alert("Erro", err?.message ?? "Checkout falhou.");
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
          <Text style={styles.title}>Check Out Book</Text>

          <View style={styles.block}>
            <Text style={styles.sectionTitle}>Choose mode</Text>
            <View style={styles.modeRow}>
              <ModeChip label="1) User ID" value={MODES.USER_ID} />
              <ModeChip label="2) Existing CC" value={MODES.CC_LOOKUP} />
              <ModeChip label="3) Create user" value={MODES.CREATE_USER} />
            </View>
          </View>

          {mode === MODES.USER_ID && (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Existing User ID</Text>
              <TextInput
                style={styles.input}
                placeholder="User ID (e.g., UserClientPaulo1)"
                value={userId}
                onChangeText={setUserId}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />
            </View>
          )}

          {mode === MODES.CC_LOOKUP && (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Search for CC</Text>
              <TextInput
                style={styles.input}
                placeholder="Citizen Card (CC)"
                value={cc}
                onChangeText={setCC}
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
              />
              <Text style={styles.helper}>
                You only need the CC. If it doesn't exist, go to "Create user".
              </Text>
            </View>
          )}

          {mode === MODES.CREATE_USER && (
            <View style={styles.block}>
              <Text style={styles.sectionTitle}>Create new user</Text>
              <TextInput
                style={styles.input}
                placeholder="Citizen Card (CC)"
                value={cc}
                onChangeText={setCC}
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
              />
              <Text style={styles.roleLabel}>Role</Text>
              <View style={styles.roleRow}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    style={[
                      styles.roleChip,
                      role === r && styles.roleChipActive,
                    ]}
                  >
                    <Text
                      style={
                        role === r ? styles.roleTextActive : styles.roleText
                      }
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.helper}>
                If the CC already exists, the existing one will be used (does
                not duplicate).
              </Text>
            </View>
          )}

          <Button title="Done" onPress={handleCheckout} color="#007BFF" />

          {checkoutData && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Checkout ID: {checkoutData.id}
              </Text>
              <Text style={styles.resultText}>ISBN: {checkoutData.isbn}</Text>
              <Text style={styles.resultText}>
                Due Date: {new Date(checkoutData.dueDate).toLocaleDateString()}
              </Text>
              <View style={styles.goBackButton}>
                <Button
                  title="Go Back"
                  onPress={() => navigation.goBack()}
                  color="#007BFF"
                />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  block: { marginBottom: 18 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  helper: { color: "#bbb", fontSize: 12, marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 8,
  },

  modeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  modeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
  },
  modeChipActive: { backgroundColor: "#fff" },
  modeText: { color: "#fff" },
  modeTextActive: { color: "#000", fontWeight: "600" },

  roleLabel: { color: "#ddd", marginTop: 12 },
  roleRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  roleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "transparent",
  },
  roleChipActive: { backgroundColor: "#fff" },
  roleText: { color: "#fff" },
  roleTextActive: { color: "#000", fontWeight: "600" },

  resultContainer: {
    marginTop: 24,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
  },
  resultText: { fontSize: 16, color: "#333", marginBottom: 5 },
  goBackButton: { marginTop: 16, width: "50%" },
});

export default CheckOutScreen;
