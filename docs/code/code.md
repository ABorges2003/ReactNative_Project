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

---

## 🚧 Next Steps
- Implement UC2 (List books of a library).  
- Add new modals and features for creating/editing libraries.  

