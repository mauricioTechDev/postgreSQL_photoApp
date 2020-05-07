const express = require('express');
const app = express();
const cors = require('cors');

var passport = require('passport');
var request = require('request');
var flash    = require('connect-flash');

var morgan              = require('morgan');
var cookieParser        = require('cookie-parser');
var bodyParser          = require('body-parser');
var session      = require('express-session');

// Import DB
const pool = require('./config/db')

//img uploads
var multer  = require('multer')


//middleware
app.use(cors());
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
const expressSession = require('express-session');
app.use(session({
    secret: 'mySecretPostgres', // session secret
    resave: true,
    saveUninitialized: true
}));;

app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static('public'))
var path = require('path');
app.use('/public', express.static(__dirname + '/public'));


app.use(flash());
app.use(bodyParser.json());
//Allos to get data from the req.body to get json data
app.use(express.json())


app.set('view engine', 'ejs');
app.set('view options', { layout: false });


require('./config/passport.js')(app);
require('./app/routes.js')(app, pool, multer);

var port = process.env.PORT || 3000



app.listen(port, () => {
  console.log('Server 3000 is on fire!!!')
})

//20
