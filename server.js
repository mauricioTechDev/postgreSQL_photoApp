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
// app.use(session({secret: 'mySecretKey'}));
app.use(bodyParser.json());
// app.use(session({secret: 'keyboard cat'}))
//Allos to get data from the req.body to get json data
app.use(express.json())


//ejs
app.set('view engine', 'ejs');
app.set('view options', { layout: false });


require('./config/passport.js')(app);
require('./app/routes.js')(app, pool, multer);
// ROUTES
//aysnc makes async await which wait for funtion to comlete
// app.post('/todos', async (req, res) => {
//   try {
//     const { description } = req.body;
//     const newTodo = await pool.query(
//       //The $1 is the pg library that allows us to add dynamic data
//       //return * allows to return table after post so I can see json data in postman
//       'INSERT INTO todo (description) VALUES($1) RETURNING *',
//       [description]
//     );
//     res.json(newTodo.rows[0])
//   } catch (err) {
//     console.error(err.message)
//   }
// })
//
// app.get('/todos', async( req, res) => {
//   try {
//     const allTodos = await pool.query("SELECT * FROM todo")
//
//     res.json(allTodos)
//   } catch (error) {
//     console.error(error.message);
//   }
// })
//
// app.get('/todos/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await pool.query("SELECT * FROM todo where todo_id = $1", [id])
//
//     res.json(todo.rows[0])
//   } catch (error) {
//     console.error(error);
//   }
// })
//
// // update
// app.put("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;
//     const updateTodo = await pool.query(
//       "UPDATE todo SET description = $1 WHERE todo_id = $2",
//       [description, id]
//     );
//
//     res.json("Todo was updated")
//   } catch (error) {
//     console.error(error);
//   }
// })
//
// app.delete("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteTodo = await pool.query(
//       "DELETE FROM todo WHERE todo_id = $1",
//       [ id ]
//     );
//     res.json("Todo was deleted")
//   } catch (error) {
//     console.error(error);
//   }
// })



app.listen(3000, () => {
  console.log('Server 3000 is on fire!!!')
})

//20
