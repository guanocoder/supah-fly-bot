'use strict';

const pg = require('pg');
pg.defaults.ssl = true;

let pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
process.on('exit', function() {
    console.log("Drying out connnection pool!");
    pool.end(); 
});

exports.registerHit = function(fileId) {
    return pool.query({
        text: `update inline_result
               set hits = hits + 1
               where file_id = $1`,
        values: [fileId]
    });
}

exports.addResult = function(type, fileId) {
    return pool.query({
        text: "insert into inline_result(file_id, type) values($1, $2) on conflict do nothing",
        values: [fileId, type]
    });
};

exports.addKeywordResult = function(keyword, fileId) {
    return pool.query({
        text: "insert into inline_keyword_result(keyword, file_id) values($1, $2) on conflict do nothing",
        values: [keyword, fileId]
    });
};

exports.lookupResults = function(keyword) {
    let parameter = (typeof(keyword) == 'string') ? `%${keyword.toLowerCase()}%` : '';
    return pool.query({
        // Always return result, even if there is no match
        // matched items first, then by popularity and finally by creation date
        text:  `SELECT
                    results.type, results.file_id,
                    CASE WHEN keyword LIKE $1 THEN true ELSE false END as isMatch
                FROM
                    inline_keyword_result keys
                JOIN
                    inline_result results ON results.file_id = keys.file_id
                GROUP BY results.type, results.file_id, isMatch
                ORDER BY
                    isMatch DESC, hits DESC, createdate DESC
                LIMIT 50`, // telegram bot API's answerInlineQuery method does not allow more than 50 results per query.
        values: [parameter],
        //rowMode: 'array'
    });
};
