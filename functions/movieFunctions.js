const database = require('./database.js')
const SP = require('./storedProcedure')
const db = database.db

const favoriteMovie = (movieID, userName) => {
    // Add movie to user's favorites list.
    return new Promise((resolve,reject) => {
        sql = `
        INSERT INTO Favorites VALUES(${movieID}, '${userName}')
        `
        try{
            db.query(sql, (e, result) => {
                if(e) 
                    throw e
                resolve(true)
            });
        }
        catch{
            reject(false)
        }
    }).catch((e)=>{
        console.log(e)
    })
}

const removeFavoriteMovie = (movieID, userName) => {
    // Remove the movie from the user's favorites list.
    return new Promise((resolve,reject) => {
        sql = `
        DELETE FROM Favorites WHERE movieID = ${movieID} AND userName LIKE '${userName}'
        `
        try{
            db.query(sql, (e, result) => {
                if(e) 
                    throw e
                resolve(true)
            });
        }
        catch{
            reject(false)
        }
    }).catch((e)=>{
        console.log(e)
    })
}

const makeComment = (userName, movieID, txt) => {
    // Make a new comment on a movie by a user.

    return new Promise((resolve, reject) => {
        SP.getMaxCommentID().then((commentID) => {
            sql = `
            INSERT INTO Comment VALUES(${commentID + 1}, ${db.escape(txt)})
            `
            try{
                db.query(sql, (e, result) => {if(e) throw e})
            }
            catch{
                reject(false)
            }
            
            sql = `
            INSERT INTO MakeCom VALUES('${userName}', ${commentID + 1})
            `
            try{
                db.query(sql, (e, result) => {if(e) throw e})
            }
            catch{
                reject(false)
            }
            
            sql = `
            INSERT INTO HaveCom VALUES(${movieID}, ${commentID + 1})
            `
            try{
                db.query(sql, (e, result) => {if(e) throw e})
            }
            catch{
                reject(false)
            }
            
            resolve(true)
        });
        }).catch((e)=>{
            console.log(`ERROR IN makeComment ${e}`)
    })
}

const rateMovie = (movieID, userName, rating) => {
    // Make a new rating for a movie.

    return new Promise((resolve, reject) => {
        SP.getMaxRatingID().then((ratingID) => {
            sql = `
            INSERT INTO UserRating VALUES(${ratingID + 1}, ${rating})
            `
            try{
                db.query(sql, (e, result) => {if(e) throw e})
            }
            catch{
                reject(false)
            }
            
            sql = `
            INSERT INTO MakeRating VALUES('${userName}', ${ratingID + 1})
            `
            try{
                db.query(sql, (e, result) => {if(e) throw e})
            }
            catch{
                reject(false)
            }
            
            sql = `
            INSERT INTO HaveRating VALUES(${movieID}, ${ratingID + 1})
            `
            try{
                db.query(sql, (e, result) => {if(e) throw e})
            }
            catch{
                reject(false)
            }
            
            resolve(true)
        });
        }).catch((e)=>{
            console.log(`ERROR IN makeComment ${e}`)
    })
}

const updateRating = (movieID, userName, rating) => {
    // If a user has already rated the movie, only update it.
    
    return new Promise((resolve, reject) => {
        sql = `
        UPDATE UserRating
        SET rating=${rating}
        WHERE ratingID IN (
            SELECT DISTINCT hr.ratingID 
            FROM HaveRating AS hr 
            LEFT OUTER JOIN UserRating AS ur ON ur.ratingID = hr.ratingID 
            LEFT OUTER JOIN MakeRating mr ON mr.ratingID = ur.ratingID 
            WHERE mr.userName LIKE '${userName}' AND hr.movieID = ${movieID}
        )
        `
        db.query(sql, (e, result) => {
            if(e) 
                throw e
        })
        resolve(true);
    })
}

module.exports = {
    favoriteMovie: favoriteMovie,
    makeComment: makeComment,
    removeFavoriteMovie: removeFavoriteMovie,
    rateMovie: rateMovie,
    updateRating: updateRating
}