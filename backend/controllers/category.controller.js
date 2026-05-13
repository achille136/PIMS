import db from "../config/db.js";

let addCategory = (req, res) => {
    let { categoryName, storageInstructions, taxRate } = req.body;
    let tr = taxRate === undefined || taxRate === null || taxRate === "" ? 0 : Number(taxRate);
    if (Number.isNaN(tr) || tr < 0) {
        return res.status(400).json({ message: "Invalid tax rate" });
    }
    let query = "INSERT INTO category (categoryName, storageInstructions, taxRate) VALUES (?, ?, ?)";
    db.query(query, [categoryName, storageInstructions || null, tr], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }
        res.status(201).json({
            message: "Category added successfully!"
        });
    });
};

let getcategories = (req, res) => {
    let query = "SELECT * FROM category ORDER BY categoryName";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "error in getting category"
            });
        }
        res.status(200).json(result);
    });
};

let deleteCategories = (req, res) => {
    let { categoryID } = req.params;
    let query = "DELETE FROM category WHERE categoryID = ?";

    db.query(query, [categoryID], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "delete failed",
                error: err.message
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category deleted"
        });
    });
};

let updateCategory = (req, res) => {
    let { categoryID } = req.params;
    let { categoryName, storageInstructions, taxRate } = req.body;
    let tr = taxRate === undefined || taxRate === null || taxRate === "" ? 0 : Number(taxRate);
    if (Number.isNaN(tr) || tr < 0) {
        return res.status(400).json({ message: "Invalid tax rate" });
    }
    let query = "UPDATE category SET categoryName = ?, storageInstructions = ?, taxRate = ? WHERE categoryID = ?";
    db.query(query, [categoryName, storageInstructions || null, tr, categoryID], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category updated successfully!"
        });
    });
};

export { addCategory, getcategories, deleteCategories, updateCategory };
