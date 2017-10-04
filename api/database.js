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

exports.lookupResults = function(keyword, count) {
    let parameter = (typeof(keyword) == 'string') ? `%${keyword.toLowerCase()}%` : '';
    return pool.query({
        // sort by popularity and then by creation date
        text:  `SELECT
                    inline_result.type, inline_result.file_id
                FROM (
                    SELECT file_id
                    FROM
                        inline_keyword_result
                    WHERE keyword LIKE $1
                    GROUP BY file_id
                ) q JOIN inline_result ON q.file_id = inline_result.file_id
                ORDER BY hits DESC, createdate DESC
                LIMIT $2`, // telegram bot API's answerInlineQuery method does not allow more than 50 results per query.
        values: [parameter, count],
        //rowMode: 'array'
    });
};

exports.getMostPopular = function() {
    return pool.query(`
        SELECT
            type, file_id
        FROM
            inline_result
        ORDER BY hits DESC, createdate DESC
        LIMIT 50
    `); // telegram bot API's answerInlineQuery method does not allow more than 50 results per query.
}
