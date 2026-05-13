import db from "../config/db.js";

let round2 = (n) => Math.round(Number(n) * 100) / 100;

let addSales = (req, res) => {
    let { medicineID, quantitySold, saleDate } = req.body;
    let qty = Number(quantitySold);
    let mid = Number(medicineID);
    if (!mid || Number.isNaN(qty) || qty <= 0 || !saleDate) {
        return res.status(400).json({
            message: "medicineID, quantitySold (>0), and saleDate are required"
        });
    }

    db.query(
        "SELECT tradeName, unitPrice FROM medicine WHERE medicineID = ?",
        [mid],
        (e1, meds) => {
            if (e1) {
                return res.status(500).json({ message: e1.message });
            }
            if (!meds.length) {
                return res.status(404).json({ message: "Medicine not found" });
            }
            let tradeName = meds[0].tradeName;
            let up = Number(meds[0].unitPrice);

            db.query("SELECT AVG(taxRate) AS avgTax FROM category", (e2, taxRows) => {
                if (e2) {
                    return res.status(500).json({ message: e2.message });
                }
                let avgTax =
                    taxRows[0] && taxRows[0].avgTax != null ? Number(taxRows[0].avgTax) : 0;
                if (Number.isNaN(avgTax) || avgTax < 0) {
                    avgTax = 0;
                }

                let lineSubtotal = round2(qty * up);
                let taxAmount = round2(lineSubtotal * avgTax);
                let totalAmount = round2(lineSubtotal + taxAmount);

                db.query(
                    "SELECT COALESCE(SUM(quantityInHand),0) AS s FROM inventory WHERE medicineID = ?",
                    [mid],
                    (e3, stockRows) => {
                        if (e3) {
                            return res.status(500).json({ message: e3.message });
                        }
                        let onHand = Number(stockRows[0].s);
                        if (onHand < qty) {
                            return res.status(400).json({
                                message: "Insufficient stock for this medicine"
                            });
                        }

                        db.beginTransaction((te) => {
                            if (te) {
                                return res.status(500).json({ message: te.message });
                            }

                            let remaining = qty;

                            let finishSale = () => {
                                let ins =
                                    "INSERT INTO sales (medicineID, quantitySold, totalAmount, saleDate) VALUES (?,?,?,?)";
                                db.query(ins, [mid, qty, totalAmount, saleDate], (e5) => {
                                    if (e5) {
                                        return db.rollback(() =>
                                            res.status(500).json({ message: e5.message })
                                        );
                                    }
                                    db.commit((e6) => {
                                        if (e6) {
                                            return res.status(500).json({ message: e6.message });
                                        }
                                        res.status(201).json({
                                            message: "Sale recorded",
                                            bill: {
                                                tradeName,
                                                quantitySold: qty,
                                                unitPrice: up,
                                                lineSubtotal,
                                                averageTaxRate: avgTax,
                                                taxAmount,
                                                totalAmount,
                                                saleDate,
                                            },
                                        });
                                    });
                                });
                            };

                            let fetchRow = () => {
                                if (remaining <= 0) {
                                    return finishSale();
                                }
                                db.query(
                                    `SELECT stockNumber, quantityInHand FROM inventory 
                                     WHERE medicineID = ? AND quantityInHand > 0 
                                     ORDER BY expiryDate IS NULL, expiryDate ASC LIMIT 1`,
                                    [mid],
                                    (e4, invRows) => {
                                        if (e4) {
                                            return db.rollback(() =>
                                                res.status(500).json({ message: e4.message })
                                            );
                                        }
                                        if (!invRows.length) {
                                            return db.rollback(() =>
                                                res.status(400).json({
                                                    message: "Stock mismatch during sale",
                                                })
                                            );
                                        }
                                        let row = invRows[0];
                                        let take = Math.min(row.quantityInHand, remaining);
                                        db.query(
                                            "UPDATE inventory SET quantityInHand = quantityInHand - ? WHERE stockNumber = ?",
                                            [take, row.stockNumber],
                                            (e5, ur) => {
                                                if (e5) {
                                                    return db.rollback(() =>
                                                        res.status(500).json({ message: e5.message })
                                                    );
                                                }
                                                if (!ur.affectedRows) {
                                                    return db.rollback(() =>
                                                        res.status(500).json({ message: "Update failed" })
                                                    );
                                                }
                                                remaining -= take;
                                                fetchRow();
                                            }
                                        );
                                    }
                                );
                            };

                            fetchRow();
                        });
                    });
                });
            }
    );
};

let getSales = (req, res) => {
    let query = `
        SELECT s.saleNumber, s.medicineID, s.quantitySold, s.totalAmount, s.saleDate, m.tradeName
        FROM sales s
        JOIN medicine m ON m.medicineID = s.medicineID
        ORDER BY s.saleDate DESC, s.saleNumber DESC
        LIMIT 500
    `;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "failed to load sales",
                error: err.message,
            });
        }
        res.status(200).json(result);
    });
};

export { addSales, getSales };
