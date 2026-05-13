-- Pharmacy schema (database name matches backend/config/db.js → epms)
CREATE DATABASE IF NOT EXISTS epms;
USE epms;

CREATE TABLE IF NOT EXISTS users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL,
    storageInstructions VARCHAR(255),
    taxRate DECIMAL(6,4) NOT NULL DEFAULT 0.0000
);

CREATE TABLE IF NOT EXISTS medicine (
    medicineID INT AUTO_INCREMENT PRIMARY KEY,
    categoryID INT NOT NULL,
    tradeName VARCHAR(100) NOT NULL,
    genericName VARCHAR(100) NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (categoryID) REFERENCES category(categoryID)
);

CREATE TABLE IF NOT EXISTS inventory (
    stockNumber INT AUTO_INCREMENT PRIMARY KEY,
    medicineID INT NOT NULL,
    quantityInHand INT NOT NULL,
    expiryDate DATE NULL,
    FOREIGN KEY (medicineID) REFERENCES medicine(medicineID)
);

CREATE TABLE IF NOT EXISTS sales (
    saleNumber INT AUTO_INCREMENT PRIMARY KEY,
    medicineID INT NOT NULL,
    quantitySold INT NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    saleDate DATE NOT NULL,
    FOREIGN KEY (medicineID) REFERENCES medicine(medicineID)
);
