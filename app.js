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

//const Search = require(__dirname + '/functions/search.js')
const express = require('express');
const app = express();
const path = require('path')

app.use(connectLiveReload())

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 9090

// Go to localhost:9090 in your browser while the program is running
app.get('/', (req, res) => {
  res.render('search.pug');
/*
  const database = require('./functions/database')
  db = database.db

  sql = `SELECT * FROM testM WHERE movieID=2`

  db.query(sql, (err, result) => {
      if(err) throw err
      result.forEach(element => {
          obj = {
          title: element.movieID,
          id: element.genere
        }
        console.log(obj);
      });

  });
*/
});

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
  console.log("Hello")
  movieID = req.params['movieID']
  res.send(`${movieID}`)
})

app.get('/login', (req, res) => {
  res.render('login.pug')
})

app.get('/login/verify', (req, res) => {
  try {
    // verify login info
    // check if user exists
    // if not, deny login saying user does not exist
    // if username is correct, but passwor is not, deny entry
    //    - redirect back to login page
    //    - show message saying incorrect password
    if(req.query.userName != "Erdman"){
      throw 200
    }
  } catch (e) {
    res.redirect('/login')
  }
  res.redirect('/')
})

app.get('/signup', (req, res) => {
  res.render('signup.pug') 
})

app.get('/signup/process', (req, res) => {
  res.send(req.query.password)
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
app.get('/movie', (req, res) => {
  res.render('moviePage.pug')
})

app.get('/user', (req, res) => {
  res.render('userPage.pug')
})

app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});