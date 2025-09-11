import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import BookCard from "../components/BookCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetBooks } from "../service/LibraryService";
import { BookModal } from "../components/BookModal";
import { LIB_API_URL } from "../utils/URL";
import { Ionicons } from "@expo/vector-icons";

const LibraryBooksScreen = ({ route }) => {
  const { libraryId } = route?.params || {};
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchBooks = () => {
    if (libraryId) {
      GetBooks(libraryId)
        .then((response) => {
          setBooks(response.data || []);
        })
        .catch((error) => console.error("Error fetching books:", error));
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [libraryId]);

  // Re-fetch whenever screen regains focus (keeps list fresh after updates)
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [libraryId])
  );

  const handleBookPress = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const modalOptions = [
    {
      label: "Update Book",
      onPress: () => {
        alert("Update Book feature is in development.");
      },
    },
    {
      label: "CheckOut Book",
      onPress: () => {
        alert("CheckOut feature is in development.");
      },
    },
    {
      label: "CheckIn Book",
      onPress: () => {
        alert("CheckIn feature is in development.");
      },
    },
  ];

  const renderBookCard = ({ item }) => {
    // Build absolute cover URL if the API returns a relative path
    const coverUrl = item.book.cover?.mediumUrl
      ? LIB_API_URL + item.book.cover.mediumUrl.replace("/api", "")
      : null;
    // Immediate visual feedback: red when not available, green otherwise
    const cardBackgroundColor =
      item.available === 0
        ? "rgba(240, 87, 87, 0.7)"
        : "rgba(87, 240, 87, 0.7)";

    return (
      <TouchableOpacity
        style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}
        onPress={() => handleBookPress(item)}
      >
        <BookCard
          title={item.book.title || "Without title"}
          publishDate={item.book.publishDate || "N/A"}
          numberOfPages={item.book.numberOfPages || "N/A"}
          byStatement={item.book.byStatement || "Unknown author"}
          isbn={item.book.isbn || "Without ISBN"}
          checkedOut={item.checkedOut}
          available={item.available}
          stock={item.stock}
          coverUrl={coverUrl}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title} numberOfLines={1}>
            Books in Library
          </Text>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              alert("Add Book feature is in development.");
            }}
          >
            <Text style={styles.createButtonText}>Add New Book</Text>
          </TouchableOpacity>
        </View>

        {books.length > 0 ? (
          <FlatList
            data={books}
            keyExtractor={(item) => item.book.isbn}
            renderItem={renderBookCard}
          />
        ) : (
          <Text style={styles.noBooksText}>
            No books found in this library.
          </Text>
        )}

        <BookModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          options={modalOptions}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  createButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8, 
    borderRadius: 8,
  },
  createButtonText: {
    color: "#000",
    fontSize: 13
    ,
    fontWeight: "normal",
  },
  title: {
    flexShrink: 1, 
    textAlign: "left", 
    fontSize: 22, 
    fontWeight: "bold",
    color: "#fff",
    marginRight: 12, 
  },
  noBooksText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  cardContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default LibraryBooksScreen;
