var request = require('request');

function getURL(title) {
    if (title.endsWith(' (disambiguation)')) {
        return `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=${encodeURIComponent(title)}&redirects=`;
    }
    
    return `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=${encodeURIComponent(title)}&redirects=`;
}

function getText(title, cb) {
    request(getURL(title), function (error, response, body) {
        try {
            if (error) {cb(error, null); return;}

            for (var page in JSON.parse(body).query.pages) {
                var result = JSON.parse(body).query.pages[page].extract;
                cb(null, result);
                return;
            }
        } catch(exception) {
            if (exception instanceof TypeError) {
                try {
                    JSON.parse(body).query.pages;
                } catch (JSONError) {
                    cb(new Error("Invalid page or API error"), null);
                    return;
                }
            }

            cb(exception, null);
            return;
        }
    });
}

module.exports.page = getText;
