# 📘 Code Structure

This document describes how the project is organized and how each part of the code interacts.

---

## 🗂️ Folder Organization

- **screens/**  
  Contains the different screens of the application that are displayed on the mobile device.  
  Examples: `HomeScreen`, `LibraryListScreen`, `LibraryBooksScreen`.

- **components/**  
  Includes reusable components such as **cards** and **modals**, used to format and display information.  
  Examples: `LibraryCard`, `LibraryModal`.

- **service/**  
  Handles the communication with the API.  
  Example: `LibraryService.js` which performs HTTP requests using **Axios**.

- **utils/**  
  Stores utility values and constants, such as default URLs and API endpoints.  
  Example: `URL.js`.

---

## 🔄 General Flow

1. The user interacts with a **screen**.  
2. The screen may use **components** to display data.  
3. To fetch or send data, the screen calls functions in **service/**.  
4. The **service** communicates with the API using the endpoints defined in **utils/**.  

---

## ✅ Use Cases (UC)

This section explains how each use case was implemented.  
At the moment, only **UC1** has been started.  

### UC1 — List Libraries
- **Screen:** `LibraryListScreen`  
- **Components used:** `LibraryCard`, `LibraryModal`  
- **Service:** `GetLibraries()`  
- **Flow:**  
  1. The screen calls `GetLibraries()` to fetch libraries from the API.  
  2. The result is displayed in a list using `LibraryCard`.  
  3. When clicking on a library, a modal (`LibraryModal`) opens with options (e.g., "Get Books").  

### UC2 — Create Library
- **Screen:** `CreateLibraryScreen`  
- **Components used:** `TextInput`, day selector, `DateTimePicker` (Android native via `DateTimePickerAndroid`, iOS with `Modal` + spinner)
- **Service:** `CreateLibrary(libraryData)` → `POST /v1/library` 

**Flow (high-level):**
  1. User fills in **Name** and **Address**.  
  2. Expands “Open Days” and selects days (supports **All** as an exclusive option).  
  3. Sets **Open Time** and **Close Time**:
    - **Android:** opens native dialog, confirms on `onChange`.  
    - **iOS:** shows a `Modal` with spinner; saves and closes on `onChange`. 
  4. User taps **Create** → validation runs → builds `newLibrary` → `CreateLibrary(newLibrary)` → `goBack()` on success. 

**Key code points (where to look if changes are needed):**
- **Day selection & “All” logic**: `toggleDay()` keeps the list consistent (exclusive “All”, add/remove days). 
- **Time pickers**:  
  - Entry point and target (**open/close**) in `openTimePicker(isOpenTime)`.  
  - **Android** uses `DateTimePickerAndroid.open` (no `Modal`).  
  - **iOS** opens `Modal` and saves in `handleTimeSelect`. 
- **Saving times**: `setOpenTime(hhmm)` / `setCloseTime(hhmm)` inside the picker’s `onChange`. 
- **Validation + payload**: `handleCreateLibrary()` validates `name`, `address`, `selectedDays`, and sends `{ name, address, openDays, openTime, closeTime }`.  
- **API call**: `CreateLibrary()` defined in the service (`axios.post` to `/v1/library`). 

**Technical notes:**
- **Time format**: `"HH:MM"` (24h). To use 12h format, adjust the formatting in `onChange`.
- **Initial picker value**: derived from the current state (if already defined) for each field.
- **Android UX**: no `Modal`; native dialog avoids “phantom touches” and double taps. 

---

## 🚧 Next Steps
- Implement UC3 (Delete an existent Library).  


