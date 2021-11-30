var livereload = require('livereload');
var server = livereload.createServer();
server.watch(__dirname + "/public");

// automatically refresh home page
server.server.once("connection", () => {
  setTimeout(() => {
    server.refresh("/")
  }, 100);
});

var connectLiveReload = require("connect-livereload")

const Search = require(__dirname + '/functions/search.js')
const User = require(__dirname + '/functions/login.js')
const StoredProcedure = require(__dirname + '/functions/storedProcedure.js')

const express = require('express');
const jsStringify = require('js-stringify');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');
const exp = require('constants');

app.use(connectLiveReload());
app.use(cookieParser());




// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 9090

app.use('/', (req, res, next) => {
  Result = {
    userName: ''
  }
  userName = req.cookies.userName;
  if(userName != undefined && userName != 'undefined')
    Result.userName = userName
  next();
})

// Go to localhost:9090 in your browser while the program is running
app.get('/', (req, res) => {  
  StoredProcedure.getMovieCount().then((movieCount) => {
    Result['movieCount'] = movieCount
    StoredProcedure.getCommentCount().then((comCount) => {
      Result['comCount'] = comCount
      StoredProcedure.getUserCount().then((uCount) => {
        Result['userCount'] = uCount
        res.render('search.pug', {jsStringify, Result});
      })
    })
  })
})

app.get('/Results', (req, res) => {
  searchInput = req.query.param
  searchType = req.query.type
  Search.getMovieFromSearch(searchType, searchInput).then((queryResults) => {
    Result = queryResults
    if(Result.movies.length != 0){
      console.log(Result)
      res.render('result.pug', Result)
    }
    else {
      ErrMsg = {
        message: `Unfortunately we could not find a movie with the input of ${searchInput}`
      }
      res.render('errorScreen.pug', ErrMsg)
    }
  })
})

app.get('/movie/:movieID', (req, res) =>{
  movieID = req.params['movieID']
  Search.getMovieDetails(movieID).then((queryResults) => {
    try{
      Result = queryResults
      console.log(Result.actors)
      Result.actors.forEach(element => {
        console.log(element)
      })
      res.render('moviePage.pug', Result)
    }
    catch (err){
      ErrMsg = {
        message: "Failed to retrieve movie details"
      }
      res.render('errorScreen.pug', ErrMsg)
    }
  }).catch(e => {
    ErrMsg = {
      message: "Failed to retrieve movie details"
    }
    res.render('errorScreen.pug', ErrMsg)
  })
})


app.get('/login', (req, res) => {
  res.render('login.pug')
})

app.get('/login/verify', (req, res) => {
  userName = req.query.userName
  pwd = req.query.password
  User.verifyUserLogin(userName, pwd).then((queryResults) => {
    exists = queryResults
    if(exists == 1){
      res.redirect(`/user/${userName}`)
    }
    else if(exists == 0) // TODO: Add a pop up saying invlaid username. Pass a value that can be used for that
    res.redirect("/login")
    else{
      console.log("ERROR: User Account Quantity Invalid!")
      res.redirect("/login")
    }
  })
})

app.use('/user/:userName', (req, res, next) => {
  // check if client sent cookie
  userName = req.params['userName']
  cookie = req.cookies.userName;
  if(cookie == undefined || cookie != userName){
    // No: Set a new cookie
    res.cookie('userName', userName, {maxAge: 900000});
    console.log(`Created cookie ${req.cookies.userName}`)
  } else if(cookie == 'undefined'){
    res.clearCookie('userName');
    console.log('Slaughtered impasta cookie');
  } else{
    // Yes: Cookie exists
    console.log(`Cookie ${cookie} exists`)
  }
  next();
})

app.get('/user/:userName', (req, res) => {
  userName = req.params['userName']
  User.getUserProfile(userName).then((queryResults) => {
    Result = queryResults
    console.log(Result)
    res.render('userPage.pug', Result)
  })
})


app.get('/signup', (req, res) => {
  res.render('signup.pug') 
})

app.get('/signup/process', (req, res) => {
  userName = req.query.userName
  pwd = req.query.password
  User.checkIfUserExists(userName).then((queryResults) => {
    exists = queryResults
    if(exists == 1) // TODO: Add a pop up saying user exists already. Pass a value that can be used for that
      res.render('errorScreen.pug', ErrMsg = {message: "Account already exists :/"})
    else if(exists == 0){
      User.addNewUser(userName, pwd).then((queryResults) => {
        success = queryResults
        if(!success)
          res.render('errorScreen.pug', ErrMsg = {message: "Failed to create account :/"})
      })
      res.redirect(`/user/${userName}`)
    }
    else{
      console.log("ERROR: User Account Quantity Invalid!")
      res.redirect("/login")
    }
  })
})

app.get('/user/delete', (req, res) => {
  userName = req.cookie.userName
  User.removeUser(userName).then(User.checkIfUserExists().then((queryResults) => {
    exists = queryResults
    if(exists == 0) // TODO: Add a pop up saying user exists already. Pass a value that can be used for that
      res.render('errorScreen.pug', ErrMsg = {message: "Unknown error processing your account deletion."})
    else if(exists == 1){
      res.redirect("/")
    }
    else{
      console.log("ERROR: User Account Quantity Invalid!")
      res.redirect("/login")
    }
  }))
})
// Starts an http server on the $PORT environment variable
/*
var http = require('http')
http.createServer(app).listen(9090)
app.listen(() => {
  var server = http.createServer(this)
  console.log(server)
  return server.listen.apply(server)
});
*/


app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});