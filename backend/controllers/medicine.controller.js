import db from "../config/db.js";

let addMedicine = (req,res)=> {
    let {tradeName, genericName,categoryID} = req.body;
    let query = "INSERT INTO medicine (categoryID,tradeName,genericName,unitPrice) VALUES (?, ?, ?)";
    db.query(query, [categoryID,tradeName,genericName,unitPrice], (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "Database error",
                error: err
            });
        }
        res.status(201).json({
            message: "Category added successfully!"
        });
    });
    
}

let getMedicine = (req,res) => {
    let query ="SELECT * FROM medicine"
    db.query(query, (err,result)=> {
        if(err){
            return res.status(400).json({
                message:"error in getting category"
            
            })
        }
    })
    res.status(200).json(result)
}

let deleteMedicine = (req, res)=>{
    let {id} = req.params
    let query = "DELETE FROM medicine WHERE id=?";

    db.query(query,[id],(err,results)=>
    {
        if(err) {
            return res.status(400).json ({
                message:"byanze gusiba"
        })
        }
    
    })

    res.status(200).json({
        message:"wayisibye neza"
    })

}

let updateMedicine = (req, res) => {
    let {id} = req.params;
    let {tradeName, genericName, categoryID} = req.body;
    let query = "UPDATE medicine SET tradeName=?, genericName=?, categoryID=? WHERE id=?";
    db.query(query, [tradeName, genericName, categoryID, id], (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "Database error",
                error: err
            });
        }
        res.status(200).json({
            message: "Medicine updated successfully!"
        })
    })
}

export {addMedicine, getMedicine, deleteMedicine, updateMedicine}