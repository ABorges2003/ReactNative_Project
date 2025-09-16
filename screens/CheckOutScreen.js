import React, { useState, useEffect } from "react";
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
} from "react-native";
import { CheckOutBook } from "../service/LibraryService";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheckOutScreen = ({ route }) => {
  const { libraryId, book } = route.params;
  const [userId, setUserId] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem("userId").then((userId) => {
      if (userId) setUserId(userId);
    });
  }, []);

  // Helper to persist the latest userId after a successful checkout 
  const saveUserId = async (id) => {
    try {
      await AsyncStorage.setItem("userId", id);
    } catch (error) {
      console.error("Failed to save user ID:", error);
    }
  };

  const handleCheckout = () => {
    if (!userId) {
      Alert.alert("Error", "Please enter a user ID.");
      return;
    }

    CheckOutBook(libraryId, book.isbn, userId)
      .then((response) => {
        const { id, dueDate, book: responseBook } = response.data;
        setCheckoutData({
          id: id,
          isbn: responseBook.isbn,
          dueDate: dueDate,
        });
        saveUserId(userId);
        Keyboard.dismiss();
        Alert.alert("Success", "Book successfully checked out.");
      })
      .catch((error) => {
        console.error("Checkout error:", error);
        Alert.alert("Error", "Failed to check out book.");
      });
  };

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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter User ID:</Text>
            <TextInput
              style={styles.input}
              placeholder="User ID"
              value={userId}
              onChangeText={setUserId}
              placeholderTextColor="#aaa"
            />
          </View>
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
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  resultContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  goBackButton: {
    marginTop: 20,
    width: "50%",
  },
});

export default CheckOutScreen;
