//https://medium.com/@timtamimi/getting-started-with-authentication-in-node-js-with-passport-and-postgresql-2219664b568c


var util = require('util');
var express = require('express');
var app = express();
var passport = require("passport");

var fs = require('fs');
var request = require('request');
// const { Pool, Client } = require('pg')
const bcrypt= require('bcrypt')
const uuidv4 = require('uuid/v4');

app.use(express.static('public'));

const LocalStrategy = require('passport-local').Strategy;
// var flash    = require('connect-flash');

var currentAccountsData = [];
const pool = require('./db');
// app.use(flash())
// const pool = new Pool({
//   user: 'mauricioacosta',
//   host: 'localhost',
//   database: 'quickpound_postgres',
//   port: 5432,
// })

module.exports = function (app) {

	app.get('/', function (req, res, next) {
		res.render('index', {title: "Home", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});

		// console.log(req.user);
	});


	app.get('/join', function (req, res, next) {
		res.render('join', {title: "Join", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
	});


	app.post('/join', async function (req, res) {
    console.log(req.body);
		try{
			const client = await pool.connect()
			await client.query('BEGIN')
			var pwd = await bcrypt.hash(req.body.password, 5);
			await JSON.stringify(client.query('SELECT user_id FROM user_account WHERE email = $1', [req.body.username], function(err, result) {
				if(result.rows[0]){
					req.flash('loginMessage', 'This email address is already registered');
					res.redirect('/join');
				}
				else{
					client.query('INSERT INTO user_account (user_id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)', [uuidv4(), req.body.firstName, req.body.lastName, req.body.username, pwd], function(err, result) {
						if(err){console.log(err);}
						else {

						client.query('COMMIT')
							console.log(result)
							req.flash('success','User created.')
							res.redirect('/login');
							return;
						}
					});
				}

			}));
			client.release();
		}
		catch(e){throw(e)}
	});

	app.get('/account', async (req, res, next) => {
    // console.log(req);
		if(req.isAuthenticated()){
      // console.log(req.user[0]);
      let { email, user_id } = req.user[0]
      console.log(email, user_id);

      const userInfo = await pool.query(`
				SELECT
				user_account.user_id, user_account.first_name, user_account.last_name, user_account.email, user_account.about_me, user_account.profile_img,
				img_post.img, img_post.description, img_post.img_post_id, img_post.img_likes
				FROM user_account
				LEFT JOIN img_post
				ON user_account.user_id = img_post.id_of_img_poster
				WHERE user_account.email = $1`, [email])
			// console.log(userInfo);
			const commentCount = await pool.query(`SELECT image_commented_on_id, count(image_commented_on_id) FROM comments GROUP BY image_commented_on_id`)
			let friendRequest = await pool.query(`
				SELECT
				user_account.first_name, user_account.user_id, friends.friends_id, friends.requesterid, friends.addresseeid, friends.status, friends.friends_id
				FROM user_account
				INNER JOIN friends
				ON  friends.requesterid = user_account.user_id
				WHERE friends.addresseeid = $1 AND friends.status = 'PENDING'`, [user_id])
			// console.log('friend request', friendRequest.rows);
			let friendReguestRows = friendRequest.rows
			let filteredFriendRequest = friendReguestRows.filter(friend => {
        return !this[friend.first_name] && (this[friend.first_name] = true);
    	}, {});
			let friendsList = await pool.query(`
				SELECT
				user_account.first_name, user_account.user_id, friends.friends_id, friends.requesterid, friends.addresseeid, friends.status, friends.friends_id
				FROM user_account
				INNER JOIN friends
				ON  friends.requesterid = user_account.user_id
				WHERE friends.addresseeid = $1 AND friends.status = 'ACCEPTED'`, [user_id])
				// console.log('Friends List', friendsList);


      // console.log(userInfo.rows);
			res.render('account', {
        title: "Account",
        userInfo: userInfo.rows,
        userData: req.user[0],
				commentCount: commentCount.rows,
				friendRequest: filteredFriendRequest,
				friendsList: friendsList.rows,
        messages: {
          danger: req.flash('danger'),
          warning: req.flash('warning'),
          success: req.flash('success')
        }
      });
		}
		else{
			res.redirect('/login');
		}
	});

	app.get('/login', function (req, res, next) {
		// console.log(req);
		if (req.isAuthenticated()) {


			res.redirect('/account');
		}
		else{
			res.render('login', {title: "Log in", userData: req.user, messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}});
		}

	});

	app.get('/logout', function(req, res){

		console.log(req.isAuthenticated());
		req.logout();
		console.log(req.isAuthenticated());
		req.flash('success', "Logged out. See you soon!");
		res.redirect('/');
	});

	app.post('/login',	passport.authenticate('local', {
		successRedirect: '/account',
		failureRedirect: '/login',
		failureFlash: true
		}), function(req, res) {
			//a change below
			// req.session.user = req.user;
		if (req.body.remember) {
			req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
			} else {
			req.session.cookie.expires = false; // Cookie expires at end of session
		}
		res.redirect('/');
	});



}

passport.use('local', new  LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {

	loginAttempt();
	async function loginAttempt() {


		const client = await pool.connect()
		try{
			await client.query('BEGIN')
			var currentAccountsData = await JSON.stringify(client.query('SELECT user_id, first_name, email, password FROM user_account WHERE email = $1', [username], function(err, result) {

				if(err) {
					return done(err)
				}
				if(result.rows[0] == null){
					req.flash('danger', "Oops. Incorrect login details.");
					return done(null, false);
				}
				else{
					bcrypt.compare(password, result.rows[0].password, function(err, check) {
						if (err){
							console.log('Error while checking password');
							return done();
						}
						else if (check){
							return done(null, [{email: result.rows[0].email, user_id: result.rows[0].user_id}]);
						}
						else{
							req.flash('danger', "Oops. Incorrect login details.");
							return done(null, false);
						}
					});
				}
			}))
		}

		catch(e){throw (e);}
	};

}
))




passport.serializeUser(function(user, done) {
	// console.log(user);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});
