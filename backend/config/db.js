import mysql from 'mysql2';

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'epms'
})

db.connect((err)=>{
    if(err){
        console.log('Database connection failed ')
    }else{
        console.log('Database connected successfully');
    }
})

export default db;      