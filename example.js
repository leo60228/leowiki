var leowiki = require('./leowiki');

leowiki.page(process.argv.slice(2).join(' '), function(err, text) { // run with arguments being page title
    if (err) throw err;
    console.log(text);
});