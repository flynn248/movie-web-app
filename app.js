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
});

app.get('/Results', (req, res) => {
  res.render('result.pug')
})

app.get('/login', (req, res) => {
  res.render('login.pug')
})

app.get('/login/verify', (req, res) => {
  res.send([req.query.user_email, req.query.password])
})
// Starts an http server on the $PORT environment variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

