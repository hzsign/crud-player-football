const express = require('express');
const fileUpload = require('express-fileupload');
const connection = require('express-myconnection');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
var http = require('http');
const app = express();
var debug = require('debug')('node-mqsql-crud-app:server');
const playerRoutes = require('./routes/player.routes');
const homeRoutes = require('./routes/index.routes');


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
var port = (process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
//  */
// process.once('SIGUSR2', function () {
//   process.kill(process.pid, 'SIGUSR2');
// });

// process.on('SIGINT', function () {
//   // this is only called on ctrl+c, not restart
//   process.kill(process.pid, 'SIGINT');
// });
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
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

// // set the app to listen on the port
// app.listen(port, () => {
//     console.log(`Server running on port: ${port}`);
// });
