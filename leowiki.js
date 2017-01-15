var request = require('request');

function getDisambiguationURL(title) {
    return `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=categories&titles=${encodeURIComponent(title)}&clcategories=Category:All%20disambiguation%20pages&redirects=`
}

function getURL(title, cb) {
    request({uri:getDisambiguationURL(title).toString()}, function(error, response, body) {
        try {
            var disambiguationURL = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&titles=${encodeURIComponent(title)}&redirects=`;
            var normalURL = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=${encodeURIComponent(title)}&redirects=`;

            if (error) {cb(error, null); return;}

            for (var page in JSON.parse(body).query.pages) {
                var result = JSON.parse(body).query.pages[page].categories[0].title === "Category:All disambiguation pages";
                cb(null, result ? disambiguationURL : normalURL);
                return;
            }
        } catch(exception) {
            if (exception instanceof TypeError) {
                try {
                    JSON.parse(body).query.pages;
                    cb(null, normalURL);
                    return;
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

function getText(title, cb) {
    getURL(title, function(error, url) {
        if (error) {cb(error, null); return;}

        request(url, function (error, response, body) {
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
    });
}

module.exports.page = getText;
