CREATE DATABASE    PIMS;

USE PIMS;

-- USERS TABLE
CREATE TABLE Users (
    userID INT(10) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
);

-- CATEGORY TABLE
CREATE TABLE Category (
    categoryID INT(10) PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(100) NOT NULL,
    storageInstructions VARCHAR(255)
);

-- MEDICINE TABLE
CREATE TABLE Medicine (
    medicineID INT(10) PRIMARY KEY AUTO_INCREMENT,
    categoryID INT(10) NOT NULL,
    tradeName VARCHAR(100) NOT NULL,
    genericName VARCHAR(100) NOT NULL,
    unitPrice DECIMAL(10,2),

    FOREIGN KEY (categoryID)
    REFERENCES Category(categoryID)
);

-- INVENTORY STOCK TABLE
CREATE TABLE InventoryStock (
    stockNumber INT(10) PRIMARY KEY AUTO_INCREMENT,
    medicineID INT(10) NOT NULL,
    quantityInHand INT(100) NOT NULL,
    expiryDate DATE,

    FOREIGN KEY (medicineID)
    REFERENCES Medicine(medicineID)
);

-- SALES TABLE
CREATE TABLE Sales (
    saleNumber INT(10) PRIMARY KEY AUTO_INCREMENT,
    medicineID INT(10) NOT NULL,
    quantitySold INT(10) NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    saleDate DATE NOT NULL,

    FOREIGN KEY (medicineID)
    REFERENCES Medicine(medicineID),

);