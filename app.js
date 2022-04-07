const express = require('express');
const fileUpload = require('express-fileupload');
const connection = require('express-myconnection');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
var http = require('http');
const app = express();

const playerRoutes = require('./routes/player.routes');
const homeRoutes = require('./routes/index.routes');
const port = 2000;


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
//const db = mysql.createConnection({
//host: 'localhost',
//user: 'root',
//password: '',
//database: 'yocka'
//});

// connect to database
//db.connect((err) => {
//if (err) {
//throw err;
//}
//console.log('Connected to database');
//});
//global.db = db;

app.use(
    connection(mysql, {
        host: process.env.MYSQLHOST,
        user: process.env.MYSQLUSER, // your mysql user
        password: process.env.MYSQLPASSWORD, // your mysql password
        port: process.env.MYSQLPORT, //port mysql
        database: process.env.MYSQLDATABASE // your database name
    }, 'pool') //or single
);

// configure middleware
app.set('port', process.env.PORT || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app
app.use('/', homeRoutes);
app.use('/player', playerRoutes);
app.get('*', function (req, res, next) {
    res.status(404);

    res.render('404.ejs', {
        title: "Page Not Found",
    });

});

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});