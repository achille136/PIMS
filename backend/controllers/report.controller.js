import db from "../config/db.js";

let getDailyReport = (req, res) => {
    let date = req.query.date;
    if (!date) {
        let d = new Date();
        let m = String(d.getMonth() + 1).padStart(2, "0");
        let day = String(d.getDate()).padStart(2, "0");
        date = `${d.getFullYear()}-${m}-${day}`;
    }

    let query = `
        SELECT m.medicineID,
               m.tradeName,
               COALESCE(SUM(s.quantitySold), 0) AS quantitySold,
               COALESCE((
                   SELECT SUM(i.quantityInHand) FROM inventory i WHERE i.medicineID = m.medicineID
               ), 0) AS remainingStock
        FROM medicine m
        LEFT JOIN sales s ON s.medicineID = m.medicineID AND DATE(s.saleDate) = ?
        GROUP BY m.medicineID, m.tradeName
        ORDER BY m.tradeName
    `;

    db.query(query, [date], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Report failed",
                error: err.message,
            });
        }
        res.status(200).json({ date, rows });
    });
};

let getDailyReportCSV = (req, res) => {
    let date = req.query.date;
    if (!date) {
        let d = new Date();
        let m = String(d.getMonth() + 1).padStart(2, "0");
        let day = String(d.getDate()).padStart(2, "0");
        date = `${d.getFullYear()}-${m}-${day}`;
    }

    let query = `
        SELECT m.medicineID,
               m.tradeName,
               COALESCE(SUM(s.quantitySold), 0) AS quantitySold,
               COALESCE((
                   SELECT SUM(i.quantityInHand) FROM inventory i WHERE i.medicineID = m.medicineID
               ), 0) AS remainingStock
        FROM medicine m
        LEFT JOIN sales s ON s.medicineID = m.medicineID AND DATE(s.saleDate) = ?
        GROUP BY m.medicineID, m.tradeName
        ORDER BY m.tradeName
    `;

    db.query(query, [date], (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Report failed",
                error: err.message,
            });
        }

        // Generate CSV
        let csv = 'Trade Name,Quantity Sold (Day),Remaining Stock\n';
        rows.forEach(row => {
            csv += `"${row.tradeName}",${row.quantitySold},${row.remainingStock}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="daily-report-${date}.csv"`);
        res.status(200).send(csv);
    });
};

export { getDailyReport, getDailyReportCSV };
