var mysql = require("mysql2");
var connection = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER, // your mysql user
    password : process.env.MYSQLPASSWORD, // your mysql password
    port : process.env.MYSQLPORT, //port mysql
    database:process.env.MYSQLDATABASE // your database name
});
connection.connect(function(error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log("Database Conected..!");
    }
});

module.exports = connection;
