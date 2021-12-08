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
const User = require(__dirname + '/functions/user.js')
const StoredProcedure = require(__dirname + '/functions/storedProcedure.js')
const MovieFunctions = require(__dirname + '/functions/movieFunctions.js')

const express = require('express');
const jsStringify = require('js-stringify');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const app = express();
const path = require('path');
const exp = require('constants');

app.use(connectLiveReload());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));



// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 9090

const verifyUserCookie = (req, res, next) => {
  Cookies = {
    userName: undefined
  }
  userName = req.cookies.userName;
  if(userName != undefined && userName != 'undefined'){
    Cookies.userName = userName
  }
  next();
}

const verifyIfFavorite = async (req, res, next) => {
  Fav = {
    isFav: undefined
  }
  if(Cookies.userName !== undefined){
    movieID = req.params['movieID'];
    await User.alreadyFavorited(movieID, userName).then((isFavorited) => {
      if(!isFavorited){
        Fav.isFav = false;
      }else{
        Fav.isFav = true;
      }
    })
  }
  next();
}

const verifyIfRated = async (req, res, next) => {
  Rate = {
    isRated: undefined
  }

  if(Cookies.userName !== undefined){
    movieID = req.params['movieID'];
    await User.alreadyRated(movieID, Cookies.userName).then((isRated) => {
      Rate.isRated = isRated;
      if(isRated){
        Rate.isRated = true;
      }else{
        Rate.isRated = false;
      }
    })
  }
  next();
}

// Go to localhost:9090 in your browser while the program is running
app.get('/', verifyUserCookie, (req, res) => {
  Result = {
    userName: Cookies.userName
  }

  StoredProcedure.getMovieCount().then((movieCount) => {
    Result['movieCount'] = movieCount;
    StoredProcedure.getCommentCount().then((comCount) => {
      Result['comCount'] = comCount;
      StoredProcedure.getUserCount().then((uCount) => {
        Result['userCount'] = uCount;
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

app.get('/movie/:movieID', verifyUserCookie, verifyIfFavorite, (req, res) =>{
  movieID = req.params['movieID'];
  Search.getMovieDetails(movieID).then((queryResults) => {
    try{
      Result = queryResults;
      Result['userName'] = Cookies.userName;
      Result['isFav'] = Fav.isFav;
      res.render('moviePage.pug', {jsStringify, Result})
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

app.post('/login/verify', (req, res) => {
  userName = req.body.userName
  pwd = req.body.password
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
  if(cookie === undefined || cookie !== userName){
    // No: Set a new cookie
    res.cookie('userName', userName, {maxAge: 9000000});
  } else if(cookie === 'undefined'){
    res.clearCookie('userName');
    console.log('Slaughtered impasta cookie');
  }
  next();
})

app.get('/user/:userName', (req, res) => {
  userName = req.params['userName']
  User.getUserProfile(userName).then((queryResults) => {
    Result = queryResults
    res.render('userPage.pug', Result)
  })
})


app.get('/signup', (req, res) => {
  res.render('signup.pug') 
})

app.post('/logout', (req, res) => {
  res.clearCookie('userName');
  res.redirect("/");
})

app.post('/signup/process', (req, res) => {
  userName = req.body.userName
  pwd = req.body.password
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

app.post('/delete', (req, res) => {
  userName = req.cookies.userName
  User.removeUser(userName).then(User.checkIfUserExists().then((exists) => {
    if(exists == 0){ 
      res.clearCookie('userName');
      res.redirect("/");
    } 
    else if(exists == 1){
      res.render('errorScreen.pug', ErrMsg = {message: "Unknown error processing your account deletion."})
    }
    else{
      console.log("ERROR: User Account Quantity Invalid!")
      res.redirect("/login")
    }
  }))
})

app.post('/comment/:movieID', (req, res) => {
  userName = req.cookies.userName
  movieID = req.params['movieID']
  txt = req.body.comments
  if(userName === undefined || userName === 'undefined'){
    res.redirect(`/movie/${movieID}`)
  }else{
    MovieFunctions.makeComment(userName, movieID, txt).then((result) => {
      success = result;
      if(!success){
        res.render('errorScreen.pug', ErrMsg = {message: "Unknown error processing your comment."})
      }
      res.redirect(`/movie/${movieID}`)
    })
  }

})

app.post('/favorite/:movieID', (req, res) => {
  userName = req.cookies.userName
  movieID = req.params['movieID']
  MovieFunctions.favoriteMovie(movieID, userName).then((result) => {
    success = result
    if(success){
      res.redirect(`/movie/${movieID}`)
    }else{
      res.render('errorScreen.pug', ErrMsg = {message: "Failed to add movie from favorites."})
    }
  })
})

app.post('/removeFavorite/:movieID', (req, res) => {
  userName = req.cookies.userName;
  movieID = req.params['movieID'];
  MovieFunctions.removeFavoriteMovie(movieID, userName).then((success) => {
    if(success){
      res.redirect(`/movie/${movieID}`)
    }else{
      res.render('errorScreen.pug', ErrMsg = {message: "Failed to remove movie from favorites."})
    }
  })
})

app.post('/rate/:movieID/:rateValue', verifyIfRated, (req, res) => {
  userName = req.cookies.userName;
  movieID = req.params['movieID'];
  rating = req.params['rateValue'];

  if(Rate.isRated === true){
    MovieFunctions.updateRating(movieID, userName, rating).then((success) => {
      if(success){
        res.redirect(`/movie/${movieID}`)
      }else{
        res.render('errorScreen.pug', ErrMsg = {message: "Failed to rate movie."})
      }

    })
  }else{
    MovieFunctions.rateMovie(movieID, userName, rating).then((success) => {
      if(success){ 
        res.redirect(`/movie/${movieID}`)
      }else{
        res.render('errorScreen.pug', ErrMsg = {message: "Failed to rate movie."})
      }
    })
  }
})

app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});