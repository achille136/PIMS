import db from "../config/db.js";

let addInventory = (req, res) => {
    let { medicineID, quantityInHand, expiryDate } = req.body;
    let q = quantityInHand === undefined ? NaN : Number(quantityInHand);
    if (!medicineID || Number.isNaN(q) || q < 0) {
        return res.status(400).json({ message: "Invalid inventory fields" });
    }
    let query = "INSERT INTO inventory (medicineID, quantityInHand, expiryDate) VALUES (?, ?, ?)";
    db.query(query, [medicineID, q, expiryDate || null], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "inserting error",
                error: err.message
            });
        }
        res.status(201).json({
            message: "inventory added"
        });
    });
};

let getInventory = (req, res) => {
    let query = `
        SELECT i.stockNumber, i.medicineID, i.quantityInHand, i.expiryDate,
               m.tradeName, m.genericName, m.unitPrice, c.categoryName
        FROM inventory i
        JOIN medicine m ON m.medicineID = i.medicineID
        LEFT JOIN category c ON c.categoryID = m.categoryID
        ORDER BY m.tradeName, i.expiryDate IS NULL, i.expiryDate ASC
    `;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "failed to select",
                error: err.message
            });
        }
        res.status(200).json(result);
    });
};

export { getInventory, addInventory };
