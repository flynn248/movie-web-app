const database = require('./database.js')
const db = database.db

const addNewUser = async (UN, PWD) => {
    return new Promise((resolve, reject) => {
        sql = `
        INSERT INTO User VALUES('${UN}', '${PWD}')
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
            resolve(true)
        })
    })
}

const removeUser = async (UN) => {
    return new Promise((resolve, reject) => {
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

const checkIfUserExists = async (UN) => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT COUNT(DISTINCT userName) AS count
        FROM User
        WHERE userName = '${UN}'
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
const verifyUserLogin = async (UN, PWD) => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT COUNT(DISTINCT userName) AS count
        FROM User
        WHERE userName = '${UN}' AND pwd = '${PWD}'
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
const getUserProfile = async uN => {
    return new Promise((resolve, reject) => {
        sql = `
        SELECT DISTINCT u.userName, 
                        f.movieID AS favMovieID, 
                        m.title
        FROM User AS u
        LEFT OUTER JOIN Favorites AS f ON f.userName = '${uN}'
        LEFT OUTER JOIN Movie AS m ON f.movieID = m.movieID
        WHERE u.userName = '${uN}'
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

const queryComments = async (uN, userDetails) => {
    sql = `
    SELECT DISTINCT c.commentID, c.txt, 
                    hC.movieID AS comMovieID
    FROM User AS u
    LEFT OUTER JOIN MakeCom AS mC ON mC.userName = '${uN}'
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

module.exports = {
    getUserProfile: getUserProfile,
    verifyUserLogin: verifyUserLogin,
    checkIfUserExists: checkIfUserExists,
    addNewUser: addNewUser,
    removeUser: removeUser
}