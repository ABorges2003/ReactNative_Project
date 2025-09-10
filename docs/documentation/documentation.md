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





