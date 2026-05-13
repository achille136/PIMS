import db from "../config/db.js";

let addMedicine = (req, res) => {
    let { tradeName, genericName, categoryID, unitPrice } = req.body;
    let up = unitPrice === undefined || unitPrice === null ? NaN : Number(unitPrice);
    if (!tradeName || !genericName || !categoryID || Number.isNaN(up) || up < 0) {
        return res.status(400).json({ message: "Invalid medicine fields" });
    }
    let query = "INSERT INTO medicine (categoryID, tradeName, genericName, unitPrice) VALUES (?, ?, ?, ?)";
    db.query(query, [categoryID, tradeName, genericName, up], (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "Database error",
                error: err.message
            });
        }
        res.status(201).json({
            message: "Medicine added successfully!"
        });
    });
};

let getMedicine = (req, res) => {
    let query = `SELECT m.*, c.categoryName 
        FROM medicine m 
        LEFT JOIN category c ON c.categoryID = m.categoryID 
        ORDER BY m.tradeName`;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "error in getting medicine",
                error: err.message
            });
        }
        res.status(200).json(result);
    });
};

let deleteMedicine = (req, res) => {
    let { medicineID } = req.params;
    let query = "DELETE FROM medicine WHERE medicineID = ?";

    db.query(query, [medicineID], (err, results) => {
        if (err) {
            return res.status(400).json({
                message: "delete failed",
                error: err.message
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json({
            message: "Medicine deleted"
        });
    });
};

let updateMedicine = (req, res) => {
    let { medicineID } = req.params;
    let { tradeName, genericName, categoryID, unitPrice } = req.body;
    let up = unitPrice === undefined || unitPrice === null ? NaN : Number(unitPrice);
    if (!tradeName || !genericName || !categoryID || Number.isNaN(up) || up < 0) {
        return res.status(400).json({ message: "Invalid medicine fields" });
    }
    let query = "UPDATE medicine SET tradeName = ?, genericName = ?, categoryID = ?, unitPrice = ? WHERE medicineID = ?";
    db.query(query, [tradeName, genericName, categoryID, up, medicineID], (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "Database error",
                error: err.message
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json({
            message: "Medicine updated successfully!"
        });
    });
};

export { addMedicine, getMedicine, deleteMedicine, updateMedicine };
