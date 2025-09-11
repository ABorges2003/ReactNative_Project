import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadBook } from "../service/LibraryService";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const LoadBookScreen = ({ route }) => {
  const {
    libraryBooks = [],
    libraryId: incomingLibId,
    isbn: incomingIsbn,
  } = route?.params || {};

  // persists the libraryId so it doesn't get lost when returning from the Scanner
  const [persistedLibraryId, setPersistedLibraryId] = useState(
    incomingLibId ?? null
  );

  const [isbn, setIsbn] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false); //loading state if the scanner is used
  const navigation = useNavigation();

  // updates the persisted ID if a new valid one arrives
  useEffect(() => {
    if (incomingLibId != null && incomingLibId !== persistedLibraryId) {
      setPersistedLibraryId(incomingLibId);
    }
  }, [incomingLibId, persistedLibraryId]);

  useEffect(() => {
    if (!incomingIsbn) return;
    const code = String(incomingIsbn);
    setIsbn(code);
    loadBookDetails(code);
    navigation.setParams({ isbn: undefined, fromScanner: undefined });
  }, [incomingIsbn]);

  const loadBookDetails = async (_isbn = isbn) => {
    if (!_isbn) {
      Alert.alert("Validation Error", "ISBN is required");
      return;
    }
    setLoading(true);
    try {
      const response = await LoadBook(_isbn); //funcion in API to see if this isbn exist in system
      setBook(response.data);
    } catch (error) {
      setBook(null);
      Alert.alert(
        "Invalid ISBN",
        "The ISBN entered does not exist in the API."
      );
    } finally {
      setLoading(false);
    }
  };

  //confirms and sends book + libraryId to AddBook
  const handleAddBook = () => {
    if (libraryBooks.includes(isbn)) {
      Alert.alert(
        "Validation Error",
        "This book already exists in the library."
      );
    } else if (book) {
      navigation.navigate("AddBook", { book, libraryId: persistedLibraryId });
    } else {
      Alert.alert(
        "Validation Error",
        "No book details loaded. Please load a book first."
      );
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpeg")}
      style={styles.background}
    >
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Load a Book</Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Scanner", {
                libraryId: persistedLibraryId ?? incomingLibId ?? null,
                libraryBooks,
              })
            }
          >
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Enter ISBN"
          value={isbn}
          onChangeText={(t) => {
            setIsbn(t);
            setBook(null);
          }}
        />

        <TouchableOpacity
          style={styles.loadButton}
          onPress={() => loadBookDetails()}
        >
          <Text style={styles.buttonText}>Load Book</Text>
        </TouchableOpacity>

        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        {book && (
          <View style={styles.bookDetails}>
            <Text style={styles.detailText}>ISBN: {book.isbn}</Text>
            <Text style={styles.detailText}>Title: {book.title}</Text>
            <Text style={styles.detailText}>
              Publish Date: {book.publishDate}
            </Text>
            <Text style={styles.detailText}>
              Number of Pages: {book.numberOfPages}
            </Text>
            <Text style={styles.detailText}>Author: {book.byStatement}</Text>

            {book.coverUrl && (
              <Image
                source={{ uri: book.coverUrl }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
              <Text style={styles.addButtonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  debugText: { color: "yellow", textAlign: "center", marginBottom: 10 },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    marginHorizontal: 20,
  },
  loadButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loadingText: { textAlign: "center", fontSize: 18, color: "#fff" },
  bookDetails: { marginTop: 20, paddingHorizontal: 20 },
  detailText: { fontSize: 16, marginBottom: 10, color: "#fff" },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  coverImage: { width: "100%", height: 200, borderRadius: 10, marginTop: 10 },
});

export default LoadBookScreen;
