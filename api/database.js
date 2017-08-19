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
    return pool.query({
        text: `select inline_result.type, inline_keyword_result.file_id
               from inline_result
               join inline_keyword_result on inline_result.file_id = inline_keyword_result.file_id
               where inline_keyword_result.keyword = $1`,
        values: [keyword],
        //rowMode: 'array'
    });
};
