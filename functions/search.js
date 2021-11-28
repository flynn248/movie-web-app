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
        SELECT DISTINCT m.movieID, m.title, m.imbdID, m.year, m.country, m.rtID, m.rtAllCriticsRating, m.rtAllCriticsNumReviews, 
        m.rtTopCriticsRating, m.rtTopCriticsNumReviews, m.rtAudienceRating, m.rtAudienceNumReviews, m.rtPicURL,
        a.aName, d.dName, c.txt, u.rating, g.genre, g.description,
        l.country AS locCountry, l.state, l.city, l.location
        FROM Movie AS m
        INNER JOIN Acted AS aJ ON aJ.movieID = ${ID}
        INNER JOIN Actor AS a ON aJ.actorID = a.actorID
        LEFT OUTER JOIN Directed AS dJ ON dJ.movieID = ${ID}
        LEFT OUTER JOIN Director AS d ON dJ.directorID = d.directorID
        LEFT OUTER JOIN HaveCom AS cJ ON cJ.movieID = ${ID}
        LEFT OUTER JOIN Comment AS c ON cJ.commentID = c.commentID
        LEFT OUTER JOIN HaveRating AS uJ ON uJ.movieID = ${ID}
        LEFT OUTER JOIN UserRating AS u ON uJ.ratingID = u.ratingID
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
                    dName: result[0].dName,
                    locCountry: result[0].locCountry,
                    locState: result[0].state,
                    locCity: result[0].city,
                    locLocal: result[0].location
                }

                actors = []
                genres = []
                comments = []
                ratings = []

                result.forEach(element => {
                    if(!actors.includes(element.aName))
                        actors.push(element.aName)
                    if(!genres.includes(element.genre))
                        genres.push(element.genre)
                    if(!comments.includes(element.txt))
                        comments.push(element.txt)
                    if(!ratings.includes(element.rating))
                        ratings.push(element.rating)
                })

                obj['actors'] = actors
                obj['genres'] = genres
                obj['comments'] = comments
                obj['ratings'] = ratings
                console.log(obj)
                rslv(obj)
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
                locCountry: '',
                locState: '',
                locCity: '',
                locLocal: '',
                actors: [],
                genres: [],
                comments: [],
                ratings: []
            }
            rjct(obj)
        }))
        resolve(movie)
    })
}

const getUserProfile = async uN => {
    return new Promise((resolve, reject) => {
        sql = `
            SELECT DISTINCT u.userName, 
                            f.movieID AS favMovieID, 
                            m.title, c.txt, 
                            hC.movieID AS comMovieID
            FROM User AS u
            LEFT OUTER JOIN Favorites AS f ON f.userName = ${uN}
            LEFT OUTER JOIN Movie AS m ON f.movieID = m.movieID
            LEFT OUTER JOIN MakeCom AS mC ON mC.userName = ${uN}
            LEFT OUTER JOIN Comment AS c ON mC.commentID = c.commentID
            LEFT OUTER JOIN HaveCom AS hC ON c.commentID = hC.commentID
            WHERE u.userName = ${uN}
        `
        const profile = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if (e) 
                throw e
            
            if(result.length != 0){
                obj = {
                    userName: result[0].userName
                }

                favMovieID = []
                favTitles = []
                comments = []
                comMovieID = []

                result.forEach(element => {
                    if(!favMovieID.includes(element.favMovieID))
                        favMovieID.push(element.favMovieID)
                    if(!favTitles.includes(element.title))
                        favTitles.push(element.title)
                    if(!comments.includes(element.txt))
                        comments.push(element.txt)
                    if(!ratings.includes(element.rating))
                        comMovieID.push(element.rating)
                })

                obj['favMovieID'] = favMovieID
                obj['favTitles'] = favTitles
                obj['comments'] = comments
                obj['comMovieID'] = comMovieID
                console.log(obj)
                rslv(obj)
            }
            obj = {
                userName: '',
                favMovieID: [],
                favTitles: [],
                comments: [],
                comMovieID: []
            }
            rjct(obj)
        }))
        resolve(profile)
    })
}

const verifyUserProfile = async (UN, PWD) => {
    return new Promise((resolve, reject) => {
        sql = `
            SELECT COUNT(DISTINCT ${UN})
            FROM User
            WHERE userName = ${UN} AND pwd = ${PWD}
        `

        const exists = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            count = result[0].count
            if(count == 0)
                rslv(0)
            else if(count == 1)
                rslv(1)
            else
                rjct(-1)
        }))
        resolve(exists)
    })
}

module.exports = {
    getMovieFromSearch: getMovieFromSearch,
    getMovieDetails: getMovieDetails,
    getUserProfile: getUserProfile,
    verifyUserProfile: verifyUserProfile
}