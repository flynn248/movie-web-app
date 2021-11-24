const database = require('./database.js')
const db = database.db

const getMovieFromSearch = (type, param) => {
    return new Promise((resolve,reject) => {
        if (type == 'title')
            sql = `SELECT movieID, title FROM Movie WHERE title LIKE ‘%${user_input}%’;`;
        else if (type == 'genre')
            sql = `SELECT DISTINCT movieID, genere FROM testM WHERE genere LIKE '%${param}%'`
        else if (type == 'director')
            sql = ``
        else if (type == 'actor')
            sql = ``
        else if (type == 'location')
            sql = ``
        else if (type == 'rating_gt')
            sql = ``
        else if (type == 'rating_ls')
            sql = ``
        
        try{
            movie_results = new Array()
            dataObj = {}

            db.query(sql, (e, result) => {
                if(e) 
                    throw e
                result.forEach(element => {
                    obj = {
                        id: element.movieID,
                        title: element.title
                    }
                movie_results.push(obj)
                });
                dataObj = {
                    movies: movie_results
                }
                resolve(dataObj)
            });
        }
        catch{
            dataObj = {
                movies: []
            }
            reject(dataObj)
        }
    }).catch((e)=>{
        console.log(e)
    })
}

const GetMovieDetails = async (id) => {
    return new Promise((resolve,reject) => {
        sql = `
            
        `
        const rows = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if (e) throw e
            if(result.length != 0){
                Title = result[0].title
                Rating = result[0].rtAllCriticsRating
                Dir = result[0].directorName
                actors = []
                genres = []
                tags = []
                comments = []
                result.forEach(element => { 
                    if(!actors.includes(element.actorName))
                        actors.push(element.actorName)
                    if(!genres.includes(element.genre))
                        genres.push(element.genre)
                    if(!tags.includes(element.tagName))
                        tags.push(element.tagName)
                    if(!comments.includes(element.content))
                        comments.push(element.content)
                });
                val = comments.pop()
                comments[0] = val
                if(val == ''){
                    comments = []
                }
                obj = {
                    title: Title,
                    director: Dir,
                    actors: actors,
                    genres: genres,
                    rating: Rating,
                    tags: tags,
                    comments: comments
                }
                rslv(obj)
            }
        obj = {
            title: '',
            director: '',
            actors: [],
            genres: [],
            rating: '',
            tags: [],
            comments: []
        }
        rjct(obj)
    }))
    resolve(rows)
    })
}

module.exports = {
    getMovieFromSearch: getMovieFromSearch,
    GetMovieDetails: GetMovieDetails
}