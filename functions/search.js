const database = require('./database.js')
const db = database.db

const getMovieFromSearch = (type, param) => {
    return new Promise((resolve,reject) => {
        if (type == 'title')
            sql = `SELECT DISTINCT movieID, title FROM Movie WHERE title LIKE '%${param}%';`;
        else if (type == 'genre')
            sql = `SELECT DISTINCT movieID, genre FROM  WHERE genere LIKE '%${param}%'`
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

const getMovieDetails = async (ID) => {
    return new Promise((resolve,reject) => {
        sql = `
            SELECT DISTINCT m.title, m.imbdID, m.year, m.country, m.rtID, m.rtAllCriticsRating, m.rtAllCriticsNumReviews, 
                m.rtTopCriticsRating, m.rtTopCriticsNumReviews, m.rtAudienceRating, m.rtAudienceNumReviews, m.rtPicURL,
                a.aName, d.dName,
                l.country, l.state, l.city, l.location
            FROM Movie AS m
            INNER JOIN Actor AS a
            INNER JOIN Acted AS aJ
            INNER JOIN Director AS d
            INNER JOIN Directed AS dJ
            INNER JOIN Location AS l
            INNER JOIN Filmed AS lJ
            ON aJ.movieID = ${ID} AND aJ.actorID = a.actorID AND
                dJ.movieID = ${ID} AND dJ.directorID = d.directorID AND
                lJ.movieID = ${ID} AND lJ.locationID = l.locationID AND
                m.movieID = ${ID}
        `
        const rows = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if (e) 
                throw e
            
            console.log(result)

            if(result.length != 0){
                Title = result[0].title
                ImbdID = result[0].imbdID
                Year = result[0].year

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
    getMovieDetails: getMovieDetails
}

/*
        sql = `
            SELECT DISTINCT m.title, m.imbdID, m.year, m.country, m.rtID, m.rtAllCriticsRating, m.rtAllCriticsNumReviews, 
                m.rtTopCriticsRating, m.rtTopCriticsNumReviews, m.rtAudienceRating, m.rtAudienceNumReviews, m.rtPicURL,
                a.aName, d.dName, c.txt, u.rating, g.genre, g.description,
                l.country, l.state, l.city, l.location
            FROM Movie AS m
            INNER JOIN Actor AS a
            INNER JOIN Acted AS aJ
            INNER JOIN Director AS d
            INNER JOIN Directed AS dJ
            INNER JOIN Comment AS c
            INNER JOIN HaveCom AS cJ
            INNER JOIN UserRating AS u
            INNER JOIN HaveRating AS uJ
            INNER JOIN Location AS l
            INNER JOIN Filmed AS lJ
            INNER JOIN Genre AS g
            INNER JOIN Classified AS gJ
            ON aJ.movieID = ${ID} AND aJ.actorID = a.actorID AND
                dJ.movieID = ${ID} AND dJ.directorID = d.directorID AND
                cJ.movieID = ${ID} AND cJ.commentID = c.commentID AND
                uJ.movieID = ${ID} AND uJ.ratingID = u.ratingID AND
                lJ.movieID = ${ID} AND lJ.locationID = l.locationID AND
                gJ.movieID = ${ID} AND gJ.genre = g.genre AND
                m.movieID = ${ID}
        `
*/