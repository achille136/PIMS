import db from "../config/db.js";

let addInventory = (req, res)=>{
    let {medicineID, quantityInHand, expiryDate} = req.body;
    let query = "INSERT INTO inventory (medicineID, quantityInHand, expiryDate) VALUES (?, ?, ?)";
    db.query(query, [medicineID, quantityInHand, expiryDate], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "inserting error"
            })
        }
        res.status(201).json({
            message: "inventory added"
        })
})
}

let getInventory = (req,res)=>{
    let query = "SELECT FROM inventory"
    db.query(query,(err,result)=> {
        if(err){
            return res.status(500).json({
                message : "failed to select"
            })
        }
        res.status(201).json({
            message : "selected well"
        })
    })
}

export {getInventory,addInventory}