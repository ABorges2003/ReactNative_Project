// AddBookScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { AddNewBook } from "../service/LibraryService";

const AddBookScreen = ({ route, navigation }) => {
  const { libraryId: incomingLibId, book } = route.params || {};
  // persists the parameters in navigate so as not to lose them between navigations
  const [libraryId, setLibraryId] = useState(incomingLibId ?? null);

  const [stock, setStock] = useState("");
  const stockNumber = Number.isFinite(parseInt(stock, 10))
    ? parseInt(stock, 10)
    : NaN;
  const isStockValid = Number.isInteger(stockNumber) && stockNumber >= 0;

  useEffect(() => {
    if (incomingLibId != null && incomingLibId !== libraryId) {
      setLibraryId(incomingLibId);
    }
  }, [incomingLibId]);

  const handleAddBook = async () => {
    if (!libraryId) {
      Alert.alert("Validation Error", "Library ID is missing.");
      return;
    }
    if (!book?.isbn) {
      Alert.alert("Validation Error", "Book data is missing.");
      return;
    }
    if (!isStockValid) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid stock number (0 or more)."
      );
      return;
    }

    try {
      await AddNewBook(libraryId, book.isbn, { stock: stockNumber });
      Alert.alert(
        "Success",
        `The book "${book.title}" was added successfully.`
      );

      navigation.navigate("LibraryBooks", {
        libraryId,
        refresh: Date.now(), 
      });
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Failed to add the book. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add Book</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Stock"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          returnKeyType="done"
        />

        {book && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>Confirm details</Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Library ID:</Text> {libraryId ?? "-"}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>ISBN:</Text> {book.isbn ?? "-"}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Title:</Text> {book.title ?? "-"}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Publish Date:</Text>{" "}
              {book.publishDate ?? "-"}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Number of Pages:</Text>{" "}
              {book.numberOfPages ?? "-"}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Author:</Text>{" "}
              {book.byStatement ?? "-"}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>Stock to add:</Text>{" "}
              {isStockValid ? stockNumber : "-"}
            </Text>
            {!libraryId && (
              <Text style={styles.warn}>
                ⚠️ Library ID not received. Return to the previous screen and
                enter Add again.
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            (!isStockValid || !libraryId) && { opacity: 0.6 },
          ]}
          onPress={handleAddBook}
          disabled={!isStockValid || !libraryId}
        >
          <Text style={styles.addButtonText}>Confirm and Add</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  reviewTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: { color: "#fff", fontSize: 16, marginBottom: 6 },
  label: { color: "#B0C4DE", fontWeight: "600" },
  warn: { color: "#FFD700", marginTop: 8 },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});

export default AddBookScreen;
