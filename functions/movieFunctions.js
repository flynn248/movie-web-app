const database = require('./database.js')
const SP = require('./storedProcedure')
const db = database.db

const favoriteMovie = (movieID, userName) => {
    return new Promise((resolve,reject) => {
        sql = `
        INSERT INTO Favorites VALUES(${movieID}, ${userName})
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
    return new Promise((resolve, reject) => {
        commentCount = SP.getMovieCount().then((count) => {
            return count
        });
        console.log(`I awaited for ${commentCount}`)
        sql = `
        INSERT INTO Comment VALUES(${commentCount + 1}, ${txt})
        `
        try{
            db.query(sql, (e, result) => {if(e) throw e})
        }
        catch{
            reject(false)
        }

        sql = `
        INSERT INTO MakeCom VALUES(${userName}, ${commentCount + 1})
        `
        try{
            db.query(sql, (e, result) => {if(e) throw e})
        }
        catch{
            reject(false)
        }

        sql = `
        INSERT INTO HaveCom VALUES(${movieID}, ${commentCount + 1})
        `
        try{
            db.query(sql, (e, result) => {if(e) throw e})
        }
        catch{
            reject(false)
        }
        
        resolve(true)
    }).catch((e)=>{
        console.log(`ERROR IN makeComment ${e}`)
    })
}
    
module.exports = {
    favoriteMovie: favoriteMovie,
    makeComment: makeComment
}