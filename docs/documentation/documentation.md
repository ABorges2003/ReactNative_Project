# 📑 Documentation

## UC1 — List Libraries

### Simple Sequence Diagram (SSD)
![SSD1](./SSD/UC1-SSD.png)

### Specification Table
| **Description**       | List all libraries available in the LibraryAPI |
|------------------------|-----------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API |
| **Post-condition**     | A list of libraries is displayed to the user  |
| **Main flow**          | 1. The user requests the list of libraries <br> 2. The API returns the list of libraries <br> 3. The system displays the list to the user |
| **Alternative flow**   | No internet/API connection |

### Sequence Diagram (SD)
![SD1](./SD/UC1-SD.png)


---

## UC2 — Create Library

### Simple Sequence Diagram (SSD)
![SSD2](./SSD/UC2-SSD.png)

### Specification Table
| **Description**       | Create a library in the LibraryAPI |
|------------------------|------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API |
| **Post-condition**     | Input fields are displayed and the user fills them with the information of the library to create |
| **Main flow**          | 1. The user requests to create a library <br> 2. The system asks the user to insert the required information <br> 3. The system creates the library in the API |
| **Alternative flow**   | Invalid data provided <br> The system returns an error |

### Sequence Diagram (SD)
![SD2](./SD/UC2-SD.png)

---

## UC3 — Delete Library

### Simple Sequence Diagram (SSD)
![SSD3](./SSD/UC3-SSD.png)

### Specification Table
| **Description**       | Delete an existing library from the LibraryAPI |
|------------------------|-----------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API and the library must exist |
| **Post-condition**     | The selected library is removed from the API and no longer displayed in the list |
| **Main flow**          | 1. The user selects a library from the list <br> 2. The user chooses the **Delete** option <br> 3. The system sends a delete request to the API <br> 4. The API confirms the deletion <br> 5. The system updates the list and shows a confirmation message |
| **Alternative flow**   | If the API request fails, the system shows an error message and the library remains in the list |

### Sequence Diagram (SD)
![SD3](./SD/UC3-SD.png)

---

## UC4 — Update Library

### Simple Sequence Diagram (SSD)
![SSD4](./SSD/UC4-SSD.png)

### Specification Table
| **Description**       | Update an existing library in the LibraryAPI |
|------------------------|----------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API and the library must exist |
| **Post-condition**     | The updated library information is saved in the API and shown in the list |
| **Main flow**          | 1. The user selects a library from the list <br> 2. The user chooses the **Update** option <br> 3. The system shows the current library details <br> 4. The user edits the details (name, address, open days, open/close time) <br> 5. The user saves changes <br> 6. The system sends an update request to the API <br> 7. The API confirms the update <br> 8. The system navigates back and shows the updated list |
| **Alternative flow**   | Invalid or incomplete data → The system shows a validation error <br> API request fails → The system shows an error message and keeps the previous data |

### Sequence Diagram (SD)
![SD4](./SD/UC4-SD.png)

---

## UC5 — Get Books from Selected Library

### Simple Sequence Diagram (SSD)
![SSD5](./SSD/UC5-SSD.png)

### Specification Table
| **Description**       | Retrieve and display all books from a selected library |
|------------------------|--------------------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API and the library must exist |
| **Post-condition**     | A list of books from the selected library is displayed to the user |
| **Main flow**          | 1. The user selects a library from the list <br> 2. The system navigates to the **LibraryBooksScreen** with the selected `libraryId` <br> 3. The system calls `GetBooks(libraryId)` from the API <br> 4. The API returns the list of books with their details (title, ISBN, pages, stock, availability, etc.) <br> 5. The system displays the list of books in a **FlatList**, each rendered by `BookCard` <br> 6. The user taps a book to open **BookModal** with available actions (Update, CheckOut, CheckIn) |
| **Alternative flow**   | If the API request fails → the system shows an error message <br> If no books are available → the system displays “No books found in this library.” |

### Sequence Diagram (SD)
![SD5](./SD/UC5-SD.png)

---

## UC6 — Create/Add Book to Library

### Simple Sequence Diagram (SSD)
![SSD6](./SSD/UC6-SSD.png)

### Specification Table
| **Description**       | Add a new book to a selected library in the LibraryAPI |
|------------------------|--------------------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API and the library must exist |
| **Post-condition**     | The selected book is registered in the library with the given stock and displayed in the list |
| **Main flow**          | 1. The user taps **Add New Book** in the `LibraryBooksScreen` <br> 2. The system navigates to `LoadBookScreen` with the `libraryId` <br> 3. The user enters an ISBN manually or scans it with the camera <br> 4. The system calls `LoadBook(isbn)` to fetch book details from the API <br> 5. If valid, book details (title, author, pages, cover, etc.) are displayed <br> 6. The user taps **Add Book** → navigates to `AddBookScreen` <br> 7. The user inputs a stock value and confirms <br> 8. The system calls `AddNewBook(libraryId, isbn, { stock })` <br> 9. The API registers the book and returns success <br> 10. The system shows a confirmation message and updates the library’s book list |
| **Alternative flow**   | Invalid ISBN → the system shows an error message <br> ISBN already in library → the system prevents duplication <br> Invalid stock value → the system shows a validation error <br> API request fails → the system shows an error message and the book is not added |

### Sequence Diagram (SD)
![SD6](./SD/UC6-SD.png)

---

## UC7 — Update Book (Stock) in Library

### Simple Sequence Diagram (SSD)
![SSD7](./SSD/UC7-SSD.png)

### Specification Table
| **Description**       | Update the stock of an existing book in a library |
|------------------------|---------------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API, the library must exist, and the book must already belong to that library |
| **Post-condition**     | The book’s stock is updated in the API and displayed with the new value in the library’s book list |
| **Main flow**          | 1. The user selects a book in the `LibraryBooksScreen` <br> 2. The system opens `BookModal` with available actions <br> 3. The user taps **Update Book** <br> 4. The system navigates to `UpdateBookScreen` with book details (title, ISBN, current stock, libraryId) <br> 5. The screen initially shows details in read-only mode <br> 6. The user taps the **Edit** icon and modifies the stock value <br> 7. The user taps **Save** <br> 8. The system calls `UpdateBook(libraryId, isbn, { stock })` <br> 9. The API confirms success and updates the book record <br> 10. The system shows a confirmation message and navigates back to `LibraryBooksScreen` where the updated stock is displayed |
| **Alternative flow**   | Invalid stock value → the system shows a validation error <br> API request fails → the system shows an error message and keeps the previous stock |

### Sequence Diagram (SD)
![SD7](./SD/UC7-SD.png)

---

## UC8 — CheckOut Book in Library

### Simple Sequence Diagram (SSD)
![SSD8](./SSD/UC8-SSD.png)  

### Specification Table
| **Description**       | Check out a book from a selected library to a user |
|------------------------|----------------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API; the library and book must exist and have available copies |
| **Post-condition**     | A checkout record is created for the given user and the book’s availability is updated |
| **Main flow**          | 1. The user selects a book in `LibraryBooksScreen` <br> 2. The system opens `BookModal` with actions <br> 3. The user taps **CheckOut Book** (only enabled if `available > 0`) <br> 4. The system navigates to `CheckOutScreen` with `libraryId` and `book.isbn` <br> 5. The user resolves the checkout identity through one of three modes: <br> &nbsp;&nbsp;• **User ID** → searches by username <br> &nbsp;&nbsp;• **CC Lookup** → searches by citizen card <br> &nbsp;&nbsp;• **Create User** → enters CC, first name, phone, and role; reuses if CC exists or creates a new user if not <br> 6. The user taps **Done** <br> 7. The system calls `POST /v1/library/{id}/book/{isbn}/checkout?userId={userId}` <br> 8. The API confirms success (returns checkout ID and due date) <br> 9. The system stores the last `userId` in `AsyncStorage`, shows a receipt (Checkout ID, ISBN, Due Date), updates the local SQLite dump, and navigates back to `LibraryBooksScreen` <br> 10. On return, the book list refreshes automatically |
| **Alternative flow**   | Missing/invalid input depending on mode → the system shows a validation error <br> No copies available → the system prevents checkout and shows an error <br> API request fails → the system shows an error message and no changes are made |

### Sequence Diagram (SD)
![SD8](./SD/UC8-SD.png)  

---

## UC9 — CheckIn Book in Library

### Simple Sequence Diagram (SSD)
![SSD9](./SSD/UC9-SSD.png)  

### Specification Table
| **Description**       | Check in a book previously checked out from a library |
|------------------------|-------------------------------------------------------|
| **Pre-condition**      | The system must be connected to the internet/API; the library and book must exist and the book must be currently checked out |
| **Post-condition**     | The check-in is recorded in the API, the book’s availability is updated, and the last used `userId` is saved locally |
| **Main flow**          | 1. The user selects a book in `LibraryBooksScreen` <br> 2. The system opens `BookModal` with actions <br> 3. The user taps **CheckIn Book** (only enabled if `checkedOut > 0`) <br> 4. The system navigates to `CheckInScreen` with `libraryId` and `book` <br> 5. The user resolves the check-in identity through one of two modes: <br> &nbsp;&nbsp;• **User ID** → searches by username in SQLite <br> &nbsp;&nbsp;• **CC Lookup** → searches by citizen card in SQLite <br> 6. The user taps **Done** <br> 7. The system calls `POST /v1/library/{id}/book/{isbn}/checkin?userId={userId}` <br> 8. The API confirms success <br> 9. The system stores the last `userId` in `AsyncStorage`, updates the local SQLite dump, shows a success message, and navigates back to `LibraryBooksScreen` <br> 10. On return, the book list refreshes automatically |
| **Alternative flow**   | Missing/invalid input depending on mode → the system shows a validation error <br> User not found in SQLite → the system shows an error <br> API request fails → the system shows an error message and no changes are made |

### Sequence Diagram (SD)
![SD9](./SD/UC9-SD.png)  
