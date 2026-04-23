# 🏠 Lloyds Mortgage Calculator

A production-ready React application built to simulate professional financial systems. This project focuses on clean architecture, automated deployment pipelines, and modular logic separation.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

---

## Live Link
https://llyodbanking-mortgage-calculator-h0gmadcfh0bvb3eh.westeurope-01.azurewebsites.net/

## 🚀 Overview

This application was developed as part of a **Technology Engineering Job Simulation** for **Lloyds Banking Group**.

It allows users to:
- Estimate monthly mortgage payments  
- Analyze total interest over time  
- Compare multiple financial scenarios side-by-side  

---

## ✨ Key Features

- **Dynamic P&I Calculations**  
  Real-time monthly payment and total interest computation  

- **Scenario Comparison**  
  Side-by-side comparison of loan terms and interest rates  

- **Visual Analytics**  
  Interactive charts for principal vs. interest breakdown  

- **CI/CD Pipeline**  
  Automated deployment to **Azure App Service** using GitHub Actions  

---

## 🏗️ Project Architecture

The application follows a modular **three-layer architecture**:

### 1. Deployment & Build Layer
- GitHub Actions for CI/CD automation  
- Production-ready build folder with optimized assets  

### 2. Product Structure Layer
- public/ → Contains index.html (entry point)  
- src/ → Core application code:
  - components/ → UI components  
  - utils/ → Business & financial logic  
  - styles/ → Styling files  
- Dependencies managed via npm and package-lock.json  

### 3. Core Logic Flow
1. **User Input** → Captured through React form components  
2. **Validation** → Input sanitization and checks  
3. **Utility Logic (finance.js)** → Handles calculations  
4. **State Management** → Managed in App.js  
5. **UI Rendering** → React updates the DOM dynamically  

---

## 📊 Logic Flow Diagram

    graph LR
      A[User Input] --> B[Validation]
      B --> C[Utility Logic]
      C --> D[State Update]
      D --> E[UI Rendering]

---

## 🛠️ Installation & Setup

### Clone the Repository

    git clone https://github.com/Ahtesham-Latif/Llyods-Banking-Group-lloyds-mortgage-calculator.git
    cd Llyods-Banking-Group-lloyds-mortgage-calculator

### Install Dependencies

    npm install

### Start Development Server

    npm start

### Run Tests

    npm test

---

## 🚀 Deployment

The application is automatically deployed using **GitHub Actions** to **Azure App Service** on every push to the main branch.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author

**Ahtesham Latif**  
Technology Engineering Job Simulation (Forage)
