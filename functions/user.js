const database = require('./database.js')
const db = database.db

const addNewUser = (UN, PWD) => {
    return new Promise((resolve, reject) => {
        sql = `
        INSERT INTO User VALUES(${db.escape(UN)}, ${db.escape(PWD)})
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
            resolve(true)
        })
    })
}

const removeUser = (UN) => {
    return new Promise((resolve, reject) => {
        sql =  `
        DELETE FROM HaveCom WHERE commentID IN (SELECT DISTINCT c.commentID FROM MakeCom c WHERE c.userName LIKE '${UN}')
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })

        sql =  `
        DELETE FROM Comment WHERE commentID IN (SELECT DISTINCT c.commentID FROM MakeCom c WHERE c.userName LIKE '${UN}')
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })

        sql = `
        DELETE FROM User WHERE userName LIKE '${UN}'
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })
        
        sql = `
        DELETE FROM Favorites WHERE userName LIKE '${UN}'
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })
        
        
        sql = `
        DELETE FROM MakeCom WHERE userName LIKE '${UN}'
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })

        sql =  `
        DELETE FROM HaveRating 
        WHERE ratingID IN (
            SELECT DISTINCT hr.ratingID 
            FROM HaveRating AS hr 
            LEFT OUTER JOIN UserRating AS ur ON ur.ratingID = hr.ratingID 
            LEFT OUTER JOIN MakeRating mr ON mr.ratingID = ur.ratingID 
            WHERE mr.userName LIKE '${UN}')
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })

        sql =  `
        DELETE FROM UserRating 
        WHERE ratingID IN (
            SELECT DISTINCT mr.ratingID 
            FROM MakeRating AS mr 
            WHERE mr.userName LIKE '${UN}')
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })

        sql = `
        DELETE FROM MakeRating WHERE userName LIKE '${UN}'
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })

        resolve(true)
    })
}

const checkIfUserExists = (UN) => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT COUNT(DISTINCT userName) AS count
        FROM User
        WHERE userName LIKE ${db.escape(UN)}
        `
        
        const exists = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if(e) 
                throw e
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

// Verify the input of the Username and Password
const verifyUserLogin = (UN, PWD) => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT COUNT(DISTINCT userName) AS count
        FROM User
        WHERE userName LIKE ${db.escape(UN)} AND pwd LIKE ${db.escape(PWD)}
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

/* 
    Return user profile information.
        -Username
        -Fav movies
        -Comments made on movies
*/
const getUserProfile = uN => {
    uN = db.escape(uN);
    return new Promise((resolve, reject) => {
        sql = `
        SELECT DISTINCT u.userName, 
                        f.movieID AS favMovieID, 
                        m.title
        FROM User AS u
        LEFT OUTER JOIN Favorites AS f ON f.userName LIKE ${uN}
        LEFT OUTER JOIN Movie AS m ON f.movieID = m.movieID
        WHERE u.userName LIKE ${uN}
        `
        const userFavMovies = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if (e) 
                throw e
            
            if(result.length != 0){
                obj = {
                    userName: result[0].userName
                } 
                favMovie = []

                result.forEach(element => {
                    movie = {
                        favMovieID: element.favMovieID,
                        favMovieTitle: element.title
                    }
                    if(!favMovie.includes(movie)){
                        favMovie.push(movie)
                    }
                })
                
                obj['favMovie'] = favMovie
                rslv(obj)
            }
            obj = {
                userName: '',
                favMovie: [{
                    favMovieID: null,
                    favMovieTitle: ''
                }]
            }
            rjct(obj)
        })).then(userDetails => { // If userFavMovies Promise was resolved
            return queryComments(uN, userDetails)
        }, rejectValue => { // If userFavMovies Promise was rejected
            return queryComments(uN, rejectValue)
        })

        resolve(userFavMovies)
    })
}

const queryComments = (uN, userDetails) => {
    sql = `
    SELECT DISTINCT c.commentID, c.txt, 
                    hC.movieID AS comMovieID
    FROM User AS u
    LEFT OUTER JOIN MakeCom AS mC ON mC.userName LIKE ${uN}
    LEFT OUTER JOIN Comment AS c ON mC.commentID = c.commentID
    LEFT OUTER JOIN HaveCom AS hC ON c.commentID = hC.commentID
    `
    return new Promise((resolve, reject) => db.query(sql, (e, result) => {
        if (e) 
            throw e
        
        if(result.length != 0){
            comments = []

            result.forEach(element => {
                movie = {
                    commentID: element.commentID,
                    txt: element.txt,
                    comMovieID: element.comMovieID
                }
                if(!comments.includes(movie)){
                    comments.push(movie)
                }
            })
            
            userDetails['comment'] = comments
            resolve(userDetails)
        }
        else{

            comments = [{
                commentID: null,
                txt: '',
                comMovieID: null
            }]
            userDetails['comment'] = comments
            reject(obj)
        }
    }))
}

const alreadyFavorited = async (movieID, UN) => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT COUNT(movieID) AS count
        FROM Favorites
        WHERE movieID = ${movieID} AND userName LIKE '${UN}'
        `
        const exists = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if(e) 
                throw e
            count = result[0].count
            if(count == 0)
                rslv(false)
            else if(count == 1)
                rslv(true)
            else
                rjct(undefined)
        }))
        resolve(exists)
    })
}

const alreadyRated = (movieID, UN) => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT COUNT(DISTINCT hr.movieID) AS count
        FROM HaveRating hr
        LEFT OUTER JOIN UserRating AS ur ON ur.ratingID = hr.ratingID
        LEFT OUTER JOIN MakeRating AS mr ON mr.ratingID = ur.ratingID
        WHERE hr.movieID = ${movieID} AND mr.userName LIKE '${UN}'
        `
        const exists = new Promise((rslv, rjct) => db.query(sql, (e, result) => {
            if(e) 
                throw e
            count = result[0].count
            if(count == 0)
                rslv(false)
            else if(count == 1)
                rslv(true)
            else
                rjct(undefined)
        }))
        resolve(exists)
    })
}

module.exports = {
    getUserProfile: getUserProfile,
    verifyUserLogin: verifyUserLogin,
    checkIfUserExists: checkIfUserExists,
    addNewUser: addNewUser,
    removeUser: removeUser,
    alreadyFavorited: alreadyFavorited,
    alreadyRated: alreadyRated
}