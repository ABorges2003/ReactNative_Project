# 📚 Library Management App

This project is a **mobile application built with React Native** for managing libraries and books.  
The main goal is to **learn React Native development** and practice working with **REST APIs** (GET, POST, PUT, DELETE, ...).

## 🚀 Project Overview
The application connects to an **API provided by a professor** as part of a university course.  
It allows users to:
- View libraries and books  
- Add new libraries or books  
- Update existing libraries or books   
- Delete items  
- Perform actions related to book checkout and management

## 🛠️ Technologies Used
- **React Native** – Mobile development framework  
- **JavaScript (ES6+)**  
- **REST API Integration** with Axios/Fetch  
- **GitHub** for version control  

## 🎯 Learning Objectives
- Understand the basics of **React Native** for mobile apps  
- Learn to **consume REST APIs** (CRUD operations)  
- Manage **state and navigation** in a React Native project  
- Gain experience in **mobile UI/UX development**  

## 📦 Features (Planned/Implemented)
-  Fetch and display data from the API  
-  Create new libraries and books  
-  Update library/book details  
-  Delete libraries or books  
-  Checkout functionality for books  
-  Additional improvements and optimizations

## 🌐 API Reference
This project consumes a REST API available at:  
👉 [Library API Swagger Documentation](http://193.136.62.24/swagger-ui.html)

## 📖 How to Run
1. Clone the repository:  
   ```bash
   git clone https://github.com/ABorges2003/ReactNative_Project.git
2. Install dependencies:  
   ```bash
   npm install
3. Start Application:  
   ```bash
   npx expo start
4. Run on your mobile device (Expo Go app) or emulator.

---

## 📱 Expo Go Requirement
To run this project on a physical device, you must use the **Expo Go app** (SDK 52).  
You can download it here: 👉 [Expo Go Download](https://expo.dev/go)  
Just select version **52** and choose Android or iOS depending on your device.

---

## 📘 Code Structure and Use Cases
👉 [Click here to see more details](./docs/code/code.md)

---

## 📑 Documentation (SD and SSDs)
👉 [Click here to see more details](./docs/documentation/documentation.md)

---

## ➕ Extra
In the **UC of Add Book**, please note that **not all ISBNs will work** with the API.  

### ✅ Example ISBNs that work with the API
You can test the following ISBNs directly in the app:  
- Twilight → `9781904233640`  
- To Kill a Mockingbird → `9780061120084`  
- Atomic Habits → `9780735211292`  
- The Art of Readable Code → `9780596802295`  
- No Longer Human → `9780811204811`  

### 🔍 Test with Swagger
If you want to check more ISBNs, you can test them in Swagger:  
**book-controller → GET `/v1/book/{isbn}` → loadBook**  
👉 [Library API Swagger Documentation](http://193.136.62.24/swagger-ui.html)
