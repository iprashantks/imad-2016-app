var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user : 'iprashantks',
    database : 'iprashantks',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one' : {
        title : 'Article One | Prashant',
        heading : 'Article One',
        date : 'Oct 16, 2016',
        content : `
            <p>Hello world</p>
            <p>This is para one</p>
        `
    },
    'article-two' : {
        title : 'Article Two | Rahul',
        heading : 'Article Two',
        date : 'Oct 18, 2016',
        content : `
            <p>Hello world</p>
            <p>This is para one of article 2</p>
        `
    },
    'article-three' : {
        title : 'Article Three | Neha',
        heading : 'Article Three',
        date : 'Oct 1, 2016',
        content : `
            <p>Hello world</p>
            <p>This is para one of article 3</p>
        `
    }
    
};

function createTemplate(data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate = `
        <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, intial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
        </html>
    `;
    
    return htmlTemplate;
    
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db', function (req, res) {
    pool.query('SELECT * FROM test', function (err, result) {
       if (err) {
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result));
       }
    });
});

app.get('/:articleName',function(req, res) {
    var articleName = req.param.articleName;
    res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
