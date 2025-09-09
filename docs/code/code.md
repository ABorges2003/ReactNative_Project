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
- **Service:** `GetLibraries()` → `GET /v1/library`  

**Flow:**  
1. When the screen loads, it calls `fetchLibraries()`.  
2. `fetchLibraries()` invokes `GetLibraries()` from the service.  
3. On success, the response (`libraryResponse.data`) is stored in state via `setLibraries()`.  
4. The list of libraries is displayed using `FlatList`, each item rendered by `LibraryCard`.  
5. On tap of a card, `handleLibraryPress()` sets the selected library and opens `LibraryModal`.  
6. Inside the modal, the user can choose actions (e.g., **Get Books**, **Delete**).  

**Key code points (where to look if changes are needed):**  
- **Service:** `api.get(ENDPOINTS.GET_LIBRARY)` inside `LibraryService.js`.  
- **Fetching:** `fetchLibraries()` uses `.then()` to update state and `.catch()` to log errors.  
- **Focus refresh:** `useFocusEffect()` triggers `fetchLibraries()` whenever the screen regains focus.  
- **Card rendering:** `renderLibraryCard` passes `name`, `address`, `openDays`, `openTime`, `closeTime` to `LibraryCard`.  
- **Modal actions:** handled in `modalOptions` array (`Get Books` → navigate, `Delete` → API call).  

**Technical notes:**  
- Data binding is defensive: if values are missing, defaults `"N/A"` are displayed.  
- `keyExtractor` ensures each item uses `item.id.toString()` to avoid duplicate key issues.  
- `SafeAreaView` and background styling ensure proper display across devices.  


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

### UC3 — Delete Library
- **Screen:** `LibraryListScreen`  
- **Components used:** `LibraryModal`, `Alert`  
- **Service:** `DeleteLibrary(libraryId)` → `DELETE /v1/library/{id}`  

**Flow:**  
1. User taps on a **Library** → opens `LibraryModal`.  
2. Chooses the **Delete** option in the modal.  
3. The screen calls `DeleteLibrary(selectedLibrary.id)`.  
4. **UI update (optimistic):** the library is removed from the in-memory list:  
   `setLibraries(prev => prev.filter(lib => lib.id !== selectedLibrary.id))`.  
5. The modal closes and an **Alert** shows a success message.  

**Key code points (where to look if changes are needed):**  
- **Service:** `api.delete(\`${ENDPOINTS.GET_LIBRARY}/${libraryId}\`)`  
- **Modal action:** `DeleteLibrary(selectedLibrary.id).then(...).catch(...)`  
- **List update:** uses `filter` to exclude the removed `id`.  
- **Feedback:** `Alert.alert("Success", "Library successfully deleted")`  

**Technical notes:**  
- The deletion is handled **optimistically** (UI updates immediately).  
- In case of error, the console logs the issue and an Alert is shown.  
- `keyExtractor` already uses `item.id.toString()`, ensuring correct rendering after deletion.  

---

## 🚧 Next Steps
- Implement UC4 (Update an existent Library).  


