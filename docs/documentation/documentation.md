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




