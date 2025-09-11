import React, { useEffect, useState, useCallback  } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground,Modal,TouchableOpacity,Pressable } from 'react-native';
import LibraryCard from '../components/LibraryCard';
import { GetLibraries } from '../service/LibraryService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {LibraryModal} from '../components/LibraryModal';
import { SafeAreaView } from "react-native-safe-area-context";
import { DeleteLibrary } from '../service/LibraryService';
import { Alert } from "react-native";

const LibraryListScreen = () => {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const fetchLibraries = () => {
    GetLibraries()
      .then((libraryResponse) => {
        setLibraries(libraryResponse.data || []);
      })
      .catch((error) => {
        console.error("Error fetching libraries: ", error);
      });
  };

  // Fetch libraries the first time the screen is loaded
  useEffect(() => {
    fetchLibraries();
  }, []);

  // Fetch libraries again every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchLibraries();
    }, [])
  );

  /**
   * Called when the user presses on a library card.
   * Opens the modal and sets the selected library.
   */
  const handleLibraryPress = (library) => {
    setSelectedLibrary(library);
    setModalVisible(true);
  };

  const modalOptions = [
    {
      label: "Get Books",
      onPress: () =>
        navigation.navigate("LibraryBooks", { libraryId: selectedLibrary.id }),
    },
    {
      label: "Delete Library",
      onPress: () => {
        DeleteLibrary(selectedLibrary.id)
          .then(() => {
            //These two lines are used to set the list of updated libraries again
            setLibraries((prevLibraries) =>
              prevLibraries.filter((lib) => lib.id !== selectedLibrary.id)
            );
            setModalVisible(false); 
            Alert.alert("Sucess","library successfully deleted");
          })
          .catch((error) => {
            console.error("Error deleting library:", error);
          });
      },
    },
    {
      label: "Update Library",
      onPress: () =>
        navigation.navigate("UpdateLibrary" , {
          library: {
          id: selectedLibrary.id,
          name: selectedLibrary.name,
          address: selectedLibrary.address,
          openDays: selectedLibrary.openDays,
          openTime:selectedLibrary.openTime,
          closeTime:selectedLibrary.closeTime,
        },
      }),
    },
  ];

  const renderLibraryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleLibraryPress(item)}
    >
      <LibraryCard
        name={item.name}
        address={item.address}
        openDays={item.openDays || "N/A"}
        openTime={item.openTime || "N/A"}
        closeTime={item.closeTime || "N/A"}
      />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/background.jpeg")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateLibrary")}
        >
          <Text style={styles.createButtonText}>Create Library</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Libraries</Text>

        <FlatList
          data={libraries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLibraryCard}
          showsHorizontalScrollIndicator={false}
        />

        <LibraryModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          options={modalOptions}
        />
      </SafeAreaView>
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
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  createButton: {
    position: "absolute",
    top: 45,
    right: 16,
    backgroundColor: "#c4c4c4ff", 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 999,
    minWidth: 120, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eaeaea", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, 
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  createButtonText: {
    color: "#111",
    fontSize: 12, 
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "left",
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

export default LibraryListScreen;



