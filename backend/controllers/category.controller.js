import db from "../config/db.js";

let addCategory = (req,res)=> {
    let {categoryName, StorageInstructions} = req.body;
    let query = "INSERT INTO Category (categoryName, StorageInstructions) VALUES (?, ?)";
    db.query(query, [categoryName, StorageInstructions], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }
        res.status(201).json({
            message: "Category added successfully!"
        });
    });
    
}

let getcategories = (req,res) => {
    let query ="SELECT * FROM category"
    db.query(query, (err,result)=> {
        if(err){
            return res.status(500).json({
                message:"error in getting category"
            
            })
        }
    })
    res.status(200).json(result)
}

let deleteCategories = (req, res)=>{
    let {id} = req.params
    let query = "DELETE FROM categories WHERE id=?";

    db.query(query,[id],(err,results)=>
    {
        if(err) {
            return res.status(500).json ({
                message:"byanze gusiba"
        })
        }
    
    })

    res.status(200).json({
        message:"wayisibye neza"
    })

}

let updateCategory = (req, res) => {
    let {id} = req.params;
    let {categoryName, StorageInstructions} = req.body;
    let query = "UPDATE category SET categoryName=?, StorageInstructions=? WHERE id=?";
    db.query(query, [categoryName, StorageInstructions, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }
        res.status(200).json({
            message: "Category updated successfully!"
        });
    });
};

export {addCategory , getcategories , deleteCategories, updateCategory}
