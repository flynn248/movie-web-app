const { query } = require('express')
const database = require('./database.js')
const db = database.db

const getMovieCount = () => {
    return new Promise((resolve, reject) => {
        sql = 'CALL getMovieCount'
        db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result[0][0].total)
        })
    })
}

const getActorCountInMovie = (mTitle) => {
    return new Promise((resolve, reject) => {
        sql = `CALL getActorCount('${mTitle}')`
        db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result[0][0].count)
        })
    })
}

const getCommentCount = () => {
    return new Promise((resolve, reject) => {
        sql = 'CALL getCommentCount'
        db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result[0][0].count)
        })
    })
}

const getUserCount = () => {
    return new Promise((resolve, reject) => {
        sql = 'CALL getUserCount'
        db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result[0][0].count)
        })
    })
}

const getMaxCommentID = () => {
    return new Promise((resolve, reject) => {
        sql = 'CALL getMaxCommentID'
        db.query(sql, (err, result) => {
            if (err) throw err;
            if(result[0][0].commentID == null){
                resolve(0)
            }
            else{
                resolve(result[0][0].commentID)
            }
        })
    })
}

const getMaxRatingID = () => {
    return new Promise((resolve, reject) => {
        sql = 'CALL getMaxRatingID'
        db.query(sql, (err, result) => {
            if (err) throw err;
            if(result[0][0].ratingID == null){
                resolve(0)
            }
            else{
                resolve(result[0][0].ratingID)
            }
        })
    })
}

module.exports = {
    getMovieCount: getMovieCount,
    getActorCountInMovie: getActorCountInMovie,
    getCommentCount: getCommentCount,
    getUserCount: getUserCount,
    getMaxCommentID: getMaxCommentID,
    getMaxRatingID: getMaxRatingID
}

/* 
Query that is being used for getMovieCount:

    DROP PROCEDURE IF EXISTS getMovieCount;
    DELIMITER $$

    CREATE PROCEDURE getMovieCount()
    BEGIN
    SELECT COUNT(DISTINCT(title)) AS total
                FROM Movie;
    END $$
    DELIMITER ;

Query that is being used for getActorCount:

    DROP PROCEDURE IF EXISTS getActorCount; 

    DELIMITER $$
    CREATE PROCEDURE getActorCount(IN inTitle VARCHAR(255))
    BEGIN
    SELECT COUNT(DISTINCT(a.aName)) AS count
    FROM Actor a, Movie m, Acted ab
    WHERE m.title LIKE inTitle AND m.movieID = ab.movieID AND ab.actorID = a.actorID;
    END $$
    DELIMITER ;
    
Query that is being used for getCommentCount:

    DROP PROCEDURE IF EXISTS getCommentCount;

    DELIMITER $$

    CREATE PROCEDURE getCommentCount()
    BEGIN
        SELECT COUNT(DISTINCT(commentID)) AS count
        FROM HaveCom;
    END $$

    DELIMITER ;

Query that is being used for getUserCount:

    DROP PROCEDURE IF EXISTS getUserCount;

    DELIMITER $$

    CREATE PROCEDURE getUserCount()
    BEGIN
        SELECT COUNT(DISTINCT(userName)) AS count
        FROM User;
    END $$

    DELIMITER ;

Query that is being used for getMaxCommentID:

    DROP PROCEDURE IF EXISTS getMaxCommentID;

    DELIMITER $$

    CREATE PROCEDURE getMaxCommentID()
    BEGIN
        SELECT MAX(DISTINCT(commentID)) AS commentID 
        FROM Comment;
    END $$

    DELIMITER ;

Query that is being used for getMaxRatingID:

    DROP PROCEDURE IF EXISTS getMaxRatingID;

    DELIMITER $$

    CREATE PROCEDURE getMaxRatingID()
    BEGIN
        SELECT MAX(DISTINCT(ratingID)) AS ratingID
        FROM UserRating;
    END $$

    DELIMITER ;
*/