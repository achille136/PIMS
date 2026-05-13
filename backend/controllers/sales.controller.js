import db from "../config/db.js";

let addSales = (req, res) => {
    let { medicineID, quantitySold, totalAmount, saleDate } = req.body
    let query = "INSERT INTO sales(medicineID,quantitySold,totalAmount,saleDate) VALUES (?,?,?,?)";
    db.query(query[medicineID, quantitySold, totalAmount, saleDate], (err, result) => {
        if(err) {
            return res.status(400).json({
                message: "try again for inserting  sales"
            })
        } 
          res.status(201).json({
            message: "byakunze"
        })
    }

    )

}

let getSales =(req,res)=> {
    let query = "SELECT FROM sales"
    db.query(query,(err, result)=>{
        if(err){
            return res.status(400).json({
                message :"ubundi wowe urikigoryi"
            })
        }
        res.status(200).json({
            message : "byakunze ghee"
        })
    })
}

export {addSales, getSales}