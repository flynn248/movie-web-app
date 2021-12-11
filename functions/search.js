const database = require('./database.js')
const db = database.db

const getMovieFromSearch = (type, param) => {
    return new Promise((resolve,reject) => {
        if (type == 'title')
            sql = `SELECT DISTINCT movieID, title FROM Movie WHERE title LIKE '%${param}%' GROUP BY title ORDER BY title`;
        else if (type == 'genre')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Classified c WHERE c.genre LIKE '%${param}%' AND c.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'director')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Director d, Directed dJ WHERE d.dName LIKE '%${param}%' AND d.directorID = dJ.directorID AND dJ.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'actor')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Actor a, Acted aJ WHERE a.aName LIKE '%${param}%' AND a.actorID = aJ.actorID AND aJ.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'released_country')
            sql = `SELECT DISTINCT movieID, title FROM Movie WHERE country LIKE '%${param}%'`
        else if (type == 'location_country')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Location l, Filmed f WHERE l.country LIKE '%${param}%' AND l.locationID = f.locationID AND f.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'location_state')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Location l, Filmed f WHERE l.state LIKE '%${param}%' AND l.locationID = f.locationID AND f.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'location_city')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Location l, Filmed f WHERE l.city LIKE '%${param}%' AND l.locationID = f.locationID AND f.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'location_local')
            sql = `SELECT DISTINCT m.movieID, m.title FROM Movie m, Location l, Filmed f WHERE l.location LIKE '%${param}%' AND l.locationID = f.locationID AND f.movieID = m.movieID GROUP BY m.title ORDER BY m.title`
        else if (type == 'rating_gt')
            sql = `SELECT DISTINCT movieID, title FROM Movie WHERE (rtAudienceRating * 2 + rtTopCriticsRating + rtAllCriticsRating)/3 >= ${param} GROUP BY title ORDER BY title`
        else if (type == 'rating_ls')
            sql = `SELECT DISTINCT movieID, title FROM Movie WHERE (rtAudienceRating * 2 + rtTopCriticsRating + rtAllCriticsRating)/3 <= ${param} GROUP BY title ORDER BY title`
        
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

const getMovieDetails = (ID) => {
    return new Promise((resolve,reject) => {  
        sql = `
        SELECT DISTINCT m.movieID, m.title, m.imbdID, m.year, m.country, m.rtID, m.rtAllCriticsRating, m.rtAllCriticsNumReviews, 
        m.rtTopCriticsRating, m.rtTopCriticsNumReviews, m.rtAudienceRating, m.rtAudienceNumReviews, m.rtPicURL,
        a.aName, d.dName, c.txt, g.genre, g.description,
        l.country AS locCountry, l.state, l.city, l.location
        FROM Movie AS m
        LEFT OUTER JOIN Acted AS aJ ON aJ.movieID = ${ID}
        LEFT OUTER JOIN Actor AS a ON aJ.actorID = a.actorID
        LEFT OUTER JOIN Directed AS dJ ON dJ.movieID = ${ID}
        LEFT OUTER JOIN Director AS d ON dJ.directorID = d.directorID
        LEFT OUTER JOIN HaveCom AS cJ ON cJ.movieID = ${ID}
        LEFT OUTER JOIN Comment AS c ON cJ.commentID = c.commentID
        LEFT OUTER JOIN Filmed AS lJ ON lJ.movieID = ${ID}
        LEFT OUTER JOIN Location AS l ON lJ.locationID = l.locationID
        LEFT OUTER JOIN Classified AS gJ ON gJ.movieID = ${ID}
        LEFT OUTER JOIN Genre AS g ON gJ.genre = g.genre
        WHERE m.movieID = ${ID}
        `
        const movie = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if (e) 
            throw e
            if(result.length != 0){
                obj = {
                    movieID: result[0].movieID,
                    title: result[0].title,
                    imbdID: result[0].imbdID,
                    year: result[0].year,
                    country: result[0].country,
                    rtID: result[0].rtID,
                    rtAllCriticsRating: result[0].rtAllCriticsRating,
                    rtAllCriticsNumReviews: result[0].rtAllCriticsNumReviews,
                    rtTopCriticsRating: result[0].rtTopCriticsRating,
                    rtTopCriticsNumReviews: result[0].rtTopCriticsNumReviews,
                    rtAudienceRating: result[0].rtAudienceRating,
                    rtAudienceNumReviews: result[0].rtAudienceNumReviews,
                    rtPicURL: result[0].rtPicURL,
                    dName: result[0].dName
                }
                
                actors = []
                genres = []
                comments = []
                shotIn = []
                
                result.forEach(element => {
                    if(!actors.includes(element.aName))
                    actors.push(element.aName)
                    if(!genres.includes(element.genre))
                    genres.push(element.genre)
                    if(!comments.includes(element.txt))
                    comments.push(element.txt)
                    
                    tmp = {
                        locCountry: element.locCountry,
                        locState: element.state,
                        locCity: element.city,
                        locLocal: element.location
                    }
                    
                    if(!shotIn.some(e => e.locCountry == element.locCountry && e.locState == element.state && e.locCity == element.city && e.locLocal == element.location)){
                        shotIn.push(tmp)
                    }
                })
                obj['actors'] = actors;
                obj['genres'] = genres;
                obj['comments'] = comments;
                obj['shotIn'] = shotIn;
                
                rslv(obj);
            }
            obj = {
                movieID: null,
                title: '',
                imbdID: null,
                year: null,
                country: '',
                rtID: null,
                rtAllCriticsRating: null,
                rtAllCriticsNumReviews: null,
                rtTopCriticsRating: null,
                rtTopCriticsNumReviews: null,
                rtAudienceRating: null,
                rtAudienceNumReviews: null,
                rtPicURL: '',
                dName: '',
                shotIn: [],
                actors: [],
                genres: [],
                comments: [],
            }
            rjct(obj)
        })).then(movieDetails => {
            // To avoid dealing with duplicated user rating values and how to handle it, separated the query for the all user's ratings from the main query.
            sql = `
            SELECT u.rating
            FROM UserRating AS u
            INNER JOIN HaveRating AS hr ON hr.ratingID = u.ratingID
            WHERE hr.movieID = ${ID}
            `
            
            return new Promise((rslv, rjct) => db.query(sql, (e, ratings) =>{
                if(e) throw e;
                movieDetails['userRating'] = null;
                if(ratings.length != 0){                    
                    var userRatingTotal = 0
                    ratings.forEach(element => {
                        userRatingTotal += element.rating
                    })
                    movieDetails.userRating = userRatingTotal / ratings.length;
                    rslv(movieDetails);
                }else{
                    rslv(movieDetails);
                }
            }))
        })
        resolve(movie)
    })
}

module.exports = {
    getMovieFromSearch: getMovieFromSearch,
    getMovieDetails: getMovieDetails
}