import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Keyboard } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CreateLibrary } from "../service/LibraryService";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CreateLibraryScreen = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [showDays, setShowDays] = useState(false);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSelectingOpenTime, setIsSelectingOpenTime] = useState(true);
  const [tempTime, setTempTime] = useState(null);
  const [pickerTime, setPickerTime] = useState(new Date());
  const navigation = useNavigation();

  //Function to Select Days
  const toggleDay = (day) => {
    if (day === "All") {
      setSelectedDays(["All"]);
    } else {
      if (selectedDays.includes("All")) {
        setSelectedDays([day]);
      } else if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      } else {
        setSelectedDays([...selectedDays, day]);
      }
    }
  };

  //Open time picker — Android uses native dialog; iOS opens Modal with spinner
  const openTimePicker = (isOpenTime) => {
    Keyboard.dismiss();
    setIsSelectingOpenTime(isOpenTime);

    const initial = (() => {
      if (isOpenTime && openTime) {
        const [h, m] = openTime.split(":").map(Number);
        return new Date(new Date().setHours(h, m, 0, 0));
      }
      if (!isOpenTime && closeTime) {
        const [h, m] = closeTime.split(":").map(Number);
        return new Date(new Date().setHours(h, m, 0, 0));
      }
      return new Date();
    })();

    if (Platform.OS === "android") {
      // ANDROID: Native dialog — no Modal, close and confirm in onChange itself
      DateTimePickerAndroid.open({
        value: initial,
        mode: "time",
        is24Hour: true,
        onChange: (event, selectedTime) => {
          if (event.type === "set" && selectedTime) {
            const pad = (n) => String(n).padStart(2, "0");
            const hhmm = `${pad(selectedTime.getHours())}:${pad(
              selectedTime.getMinutes()
            )}`;
            if (isOpenTime) setOpenTime(hhmm);
            else setCloseTime(hhmm);
          }
        },
        display: "clock",
      });
    } else {
      // iOS: open Modal with controlled spinner
      setPickerTime(initial);
      setTempTime(null);
      setShowModal(true);
    }
  };

  const handleTimeSelect = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      setPickerTime(selectedTime);

      const pad = (n) => String(n).padStart(2, "0");
      const hhmm = `${pad(selectedTime.getHours())}:${pad(
        selectedTime.getMinutes()
      )}`;

      //SET of Time Dates
      if (isSelectingOpenTime) setOpenTime(hhmm);
      else setCloseTime(hhmm);

      setShowModal(false);
      setTempTime(null);
    } else if (event.type === "dismissed") {
      setShowModal(false);
      setTempTime(null);
    }
  };

  const handleCreateLibrary = () => {
    if (!name || !address || selectedDays.length === 0) {
      Alert.alert("Validation Error", "All fields are required!");
      return;
    }

    //Create a Body for new Library
    const newLibrary = {
      name,
      address,
      openDays: selectedDays.includes("All") ? "All" : selectedDays.join(", "),
      openTime,
      closeTime,
    };

    //API request
    CreateLibrary(newLibrary)
      .then(() => {
        Alert.alert("Success", "Library created successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      })
      .catch((error) => {
        console.error("Error creating library:", error);
        Alert.alert("Error", "Failed to create the library.");
      });
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpeg")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create Library</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />

          <View style={styles.daysHeader}>
            <Text style={styles.label}>Open Days:</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowDays(!showDays)}
            >
              <Text style={styles.toggleButtonText}>
                {showDays ? "-" : "+"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDays && (
            <View style={styles.daysContainer}>
              {["All", ...daysOfWeek].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.selectedDayButton,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) &&
                        styles.selectedDayButtonText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.selectedDaysText}>
            Selected Days: {selectedDays.join(", ")}
          </Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => openTimePicker(true)}
          >
            <Text>{openTime || "Select Open Time"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => openTimePicker(false)}
          >
            <Text>{closeTime || "Select Close Time"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateLibrary}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={pickerTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "clock"}
              is24Hour={true}
              onChange={handleTimeSelect}
            />
          </View>
        </View>
      </Modal>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  daysHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  toggleButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 10,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  daysContainer: {
    width: "100%",
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedDayButton: {
    backgroundColor: "#007BFF",
  },
  dayButtonText: {
    color: "#000",
    fontSize: 16,
  },
  selectedDayButtonText: {
    color: "#fff",
  },
  selectedDaysText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalClose: {
    marginTop: 10,
  },
  modalCloseText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateLibraryScreen;
