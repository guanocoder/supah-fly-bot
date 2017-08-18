'use strict';

process.env["DATABASE_URL"] = "";

var database = require('./api/database');
var inlineDictionary = require("./bot/message-handlers/inline-dictionary");

let addKeywordPromises = [];
let addResultPromises = [];

Object.keys(inlineDictionary).forEach((keyword) => {
    console.log("Adding keyword: " + keyword);
    
    addKeywordPromises.push(
        database.addKeyword(keyword).then((response) => {
            console.log("Keyword successfully added: " + JSON.stringify(response));
        }).catch((error) => {
            console.log("Error adding keyword: " + error);
        })
    );

    let resultList = inlineDictionary[keyword];
    if(Array.isArray(resultList)) {
        resultList.forEach((result) => {
            addResultPromises.push(
                database.addResult(result.type, result.file_id).then((response) => {
                    console.log("Result successfully added: " + JSON.stringify(response));
                }).catch((error) => {
                    console.log("Error adding result: " + error);
                })
            );
        });
    }
});

// After all keywords and results are created
Promise.all(addKeywordPromises.concat(addResultPromises)).then(() => {
    Object.keys(inlineDictionary).forEach((keyword) => {
        let results = inlineDictionary[keyword];
        while(typeof(results) == "string") {
            results = inlineDictionary[results];                        
        }
        if(Array.isArray(results)) {
            results.forEach((result) => {
                database.addKeywordResult(keyword, result.file_id).then((response) => {
                    console.log("Keyword-Result pair added successfully: " + JSON.stringify(response));
                }).catch((error) => {
                    console.log("Error adding keyword-result pair: " + error);
                });
            });
        }
    });
});

/* lookup test
database.lookupResults("stfu").then((result) => {
    console.log("Received Results:");
    result.rows.forEach((row) => {
        console.log(row);
    });
}).catch((error) => {
    console.log("Some error occured: " + error);
});
*/