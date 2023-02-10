require("dotenv").config()
const mysql = require("mysql")
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,

})

con.connect(function(err){
    if(err){
        console.warn(err)
    }else{
        console.log("connection Succesful");
    }
    
});

module.exports = con;
