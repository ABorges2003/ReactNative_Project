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

---

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

---

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

### UC4 — Update Library
- **Screen:** `UpdateLibraryScreen`  
- **Components used:** `TextInput`, day selector, `DateTimePicker` (Android via `DateTimePickerAndroid`, iOS with `Modal` + spinner), `Alert`  
- **Service:** `UpdateLibrary(libraryId, libraryData)` → `PUT /v1/library/{id}`  

**Flow:**  
1. User selects a library in `LibraryListScreen` → opens `LibraryModal`.  
2. Chooses the **Update Library** option → navigates to `UpdateLibraryScreen` with current library details passed as params.  
3. Screen initially shows details in read-only mode.  
4. User taps the **Edit** button (pencil icon) → toggles edit mode.  
5. User edits fields:  
   - **Name** and **Address** via `TextInput`.  
   - **Open Days** via `toggleDay()` (exclusive “All” option or multiple days).  
   - **Open Time** and **Close Time** using time pickers:  
     - **Android:** native dialog via `DateTimePickerAndroid.open`.  
     - **iOS:** spinner inside a `Modal`.  
6. On **Save** → `saveDetails()` validates input (at least one open day) and builds payload.  
7. Calls `UpdateLibrary()` service with `{ name, address, openDays, openTime, closeTime }`.  
8. On success → shows success `Alert`, exits edit mode, and navigates back to the library list.  
9. On error → logs and shows error `Alert`.  

**Key code points (where to look if changes are needed):**  
- **Navigation:** `navigation.navigate("UpdateLibrary", { library: {...} })` in `LibraryListScreen`.  
- **Edit toggle:** `toggleEdit()` switches between read-only and editable view.  
- **Day selection logic:** `toggleDay()` ensures “All” is exclusive.  
- **Time pickers:**  
  - `openTimePicker(isOpenTime)` defines initial value and opens native picker (Android) or modal (iOS).  
  - `handleTimeSelect()` saves time as `"HH:MM"`.  
- **Validation + payload:** inside `saveDetails()`.  
- **API call:** `UpdateLibrary()` (`axios.put`) in `LibraryService.js`.  

**Technical notes:**  
- **Time format:** `"HH:MM"` (24h).  
- **Initial values:** pre-filled with current library data from navigation params.  
- **UX consistency:** time picker logic matches UC2 (Create Library).  
- **Error handling:** alerts the user and logs to console.  

---

### UC5 — Get Books from Selected Library
- **Screen:** `LibraryBooksScreen`  
- **Components used:** `BookCard`, `BookModal`, `FlatList`, `Ionicons` (back button), `Alert` (temporary)  
- **Service:** `GetBooks(libraryId)` → `GET /v1/library/{id}/book`  

**Flow:**  
1. From `LibraryListScreen`, the user selects a library and navigates to `LibraryBooksScreen` with `libraryId`.  
2. On mount and on focus, the screen calls `fetchBooks()` → `GetBooks(libraryId)` and stores `response.data` in `books`.  
3. Books are displayed with `FlatList`; each item is rendered by `BookCard` (title, ISBN, pages, author, stock, checkedOut, available).  
4. <span style="color:red">Tapping a book opens `BookModal` with actions (**Update**, **CheckOut**, **CheckIn**) that currently show “feature in development” alerts.</span> *(⚠️ Replace with real navigation once features are implemented)*  
5. If there are no books, the screen shows “No books found in this library.”  
6. The header shows a back icon (go back) and an **Add New Book** button that also displays a temporary alert.  

**Key code points (where to look if changes are needed):**  
- **Fetching:** `fetchBooks()` wraps `GetBooks(libraryId)` and updates `books`; it is called in both `useEffect` and `useFocusEffect`.  
- **Render:** `renderBookCard` builds `BookCard` and computes `coverUrl` from the API’s `cover.mediumUrl` when available.  
- **Modal:** `selectedBook` + `modalVisible`; `BookModal` receives `options` with `onPress` handlers (temporary alerts for now).  
- **Header:** back button (`navigation.goBack()`) on the left, centered/left-aligned title, and **Add New Book** on the right.  

**Technical notes:**  
- **Availability color:** cards show a semi-transparent **red** background when `available === 0`, otherwise **green** — this provides an immediate visual status of availability.  
- **Cover URL normalization:** if the API returns a relative path, it’s combined with the base URL and cleaned as needed before passing to `BookCard`.  
- **List performance:** `keyExtractor={(item) => item.book.isbn}` ensures stable keys.  
- **Placeholders:** actions in `BookModal` and the **Add New Book** button use `alert(...)` until the corresponding screens/routes are implemented.  

---

### UC6 — Create/Add Book to Library
- **Screens:** `LoadBookScreen`, `AddBookScreen`  
- **Components used:** `TextInput`, `ScrollView`, `Image`, `Alert`, `Ionicons` (scanner icon)  
- **Services:**  
  - `LoadBook(isbn)` → `GET /v1/book/{isbn}`  
  - `AddNewBook(libraryId, isbn, { stock })` → `POST /v1/library/{id}/book/{isbn}`  

**Flow:**  
1. From `LibraryBooksScreen`, the user taps **Add New Book** → navigates to `LoadBookScreen` with `libraryId` and current `libraryBooks`.  
2. In `LoadBookScreen`, the user:  
   - Enters an **ISBN** manually or  
   - Uses the **ScannerScreen** (via camera icon) to capture ISBN-13 codes.  
3. `LoadBook(isbn)` is called to fetch book metadata from the API (title, author, publish date, pages, cover).  
4. If the ISBN exists and the book is not already in `libraryBooks`, details are displayed with a preview card.  
5. User taps **Add Book** → navigates to `AddBookScreen`, passing `{ book, libraryId }`.  
6. In `AddBookScreen`, the user enters **stock quantity**.  
7. On confirm:  
   - `AddNewBook(libraryId, book.isbn, { stock })` is called.  
   - On success → shows success `Alert` and navigates back to `LibraryBooksScreen`, refreshing the list.  
   - On failure → shows error `Alert`.  

**Key code points (where to look if changes are needed):**  
- **Navigation:** `navigation.navigate("LoadBook", { libraryId, libraryBooks })` in `LibraryBooksScreen`.  
- **Validation:** prevents adding if ISBN doesn’t exist or already belongs to the library.  
- **Scanner:** `ScannerScreen` validates ISBN-13 checksum and restricts to `978/979` prefixes.  
- **Review card (AddBookScreen):** confirms library ID, ISBN, title, pages, author, and entered stock before submission.  
- **API call:** `AddNewBook()` uses `axios.post` with the selected library ID and book ISBN.  

**Technical notes:**  
- **ISBN Validation:** handled both in scanner (`isValidIsbn13`) and before API calls.  
- **Visual feedback:** cover image (`book.coverUrl`) is shown when available.  
- **Stock input:** must be an integer ≥ 0; otherwise, the confirm button is disabled.  
- **Navigation refresh:** `LibraryBooksScreen` re-fetches books on focus, so the new book appears immediately after addition.  

---

### UC7 — Update Book (Stock) in Library
- **Screen:** `UpdateBookScreen`  
- **Components used:** `TextInput`, `TouchableOpacity`, `Alert`, `Ionicons` (edit icon)  
- **Service:** `UpdateBook(libraryId, isbn, { stock })` → `PUT /v1/library/{id}/book/{isbn}`  

**Flow:**  
1. In `LibraryBooksScreen`, the user taps a book to open `BookModal`.  
2. Selects **Update Book Stock** → navigates to `UpdateBookScreen` with `libraryId`, `isbn`, `title`, and current `stock`.  
3. The screen initially shows details in read-only mode.  
4. User taps the **Edit** icon → enables editing for the stock input.  
5. User updates the stock value and taps **Save**.  
6. The system calls `UpdateBook(libraryId, isbn, { stock })`.  
7. On success → shows success `Alert` and navigates back to `LibraryBooksScreen`.  
8. On failure → logs the error and shows an error `Alert`.

**Key code points (where to look if changes are needed):**  
- **Navigation:** `navigation.navigate("UpdateBook", { book: { isbn, title, stock }, libraryId })`.  
- **Edit toggle:** toggled by the pencil icon in the header.  
- **Save logic:** `saveDetails()` validates stock, parses integer, calls `UpdateBook()`, and handles success/error alerts.  
- **Service:** `axios.put` in `LibraryService.js` handles the API update.  
- **List refresh:** `LibraryBooksScreen` re-fetches books on focus, so the updated stock is immediately shown.

**Technical notes:**  
- **Validation:** stock must be a valid integer ≥ 0.  
- **UX:** “Cancel” button discards edits and goes back; success alert confirms the change.  
- **Error handling:** invalid or empty stock → validation error; API failure → error alert and log.

---

### UC8 — CheckOut Book in Library
- **Screen:** `CheckOutScreen`  
- **Components used:** `TextInput`, `Button`, `Alert`, `KeyboardAvoidingView`, `TouchableWithoutFeedback`, `ImageBackground`, `AsyncStorage`  
- **Service:** `CheckOutBook(libraryId, isbn, userId)` → `POST /v1/library/{id}/book/{isbn}/checkout?userId={userId}`  

**Flow:**  
1. In `LibraryBooksScreen`, the user taps a book to open `BookModal`.  
2. Selects **CheckOut Book** → navigates to `CheckOutScreen` with `libraryId` and `book.isbn`.  
3. The user enters a **User ID** (if previously used, it is prefilled from `AsyncStorage`).  
4. The user taps **Done** to confirm the checkout.  
5. The system calls `CheckOutBook(libraryId, isbn, userId)`.  
6. On success → the screen shows a receipt-like summary (Checkout ID, ISBN, Due Date) and a **Go Back** button.  
7. The user goes back to `LibraryBooksScreen`, which refreshes and reflects updated availability.  
8. On failure → logs the error and shows an error `Alert`.

**Key code points (where to look if changes are needed):**  
- **Navigation:** `navigation.navigate("CheckOutMenu" | "CheckOutBook", { libraryId, book: { isbn } })` from `BookModal`.  
- **Prefill User ID:** `useEffect()` reads `AsyncStorage.getItem("userId")`.  
- **Save action:** `handleCheckout()` validates `userId`, calls `CheckOutBook()`, persists `userId` com `AsyncStorage.setItem()`, e mostra `Alert`.  
- **Success data mapping:** guarda no estado apenas `id`, `isbn`, `dueDate` para renderizar o recibo.  
- **List refresh:** retorno com `navigation.goBack()`; `LibraryBooksScreen` faz re-fetch on focus.

**Technical notes:**  
- **Validation:** `userId` obrigatório antes do call; mostrar mensagem clara em caso de falta.  
- **UX:** teclado fecha ao tocar fora (`TouchableWithoutFeedback`) e com `KeyboardAvoidingView` no iOS.  
- **Date formatting:** `new Date(dueDate).toLocaleDateString()` para apresentação amigável.  
- **Persistence:** `AsyncStorage` mantém o último `userId` para acelerar checkouts futuros.  
- **Error handling:** `try/catch` ou `.catch()` com `Alert` e `console.error` para diagnóstico.

---

## 🚧 Next Steps
- Implement UC9 (CheckIn book in the selected library) - try tu use GET "/v1/user/checked-out getCheckedOutBooks" to see the list the user have




