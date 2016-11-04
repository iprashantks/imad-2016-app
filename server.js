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
                <header>
                    <div style="float: right; text-align: right;">
                        Top Right Links
                    </div>
                    <div>
                        <a href="/">Home</a>
                    </div>
                </header>
                <hr/>
                <div class="articleArea">
                    <h3>
                        ${heading}
                    </h3>
                    <div style="font-size: 12px;">
                        ${date.toDateString()}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
                <div class="footer">
        			<table>
		        		<tr>
				        	<th>Contact Us</th>
					        <th>About Us</th>
			        		<th>Our Founders</th>
			        	</tr>
		        	</table>
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

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});


var pool = new Pool(config);

app.get('/articles/:articleName', function (req, res) {
    pool.query("SELECT * FROM articles WHERE title = $1", [req.params.articleName], function (err, result) {
       if (err) {
           res.status(500).send(err.toString());
       } else {
           if (result.rows.length === 0)
                res.status(404).send('Article not found');
            else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));   
            }
       }
    });
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
