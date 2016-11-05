// express
var express = require('express');
var app = express();

//scrapers
var request = require('request'); 
var cheerio = require('cheerio');

//body parser and morgan
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

//mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_jqqhcw19:8du45i0nfngp7q5jm0fg1fphe3@ds143767.mlab.com:43767/heroku_jqqhcw19');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//models
var Note = require('./models/Note.js');
var Nyt = require('./models/Nyt.js');


// Routes
app.use(express.static(path.join(__dirname, 'public')));
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//home with handlebars
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/scrape', function(req, res) {
	var weburl = 'http://www.nytimes.com/topic/destination/california';
	request(weburl, function(error, response, html) {
	  	var $ = cheerio.load(html);
	    var headline = [];
	    var summary = [];
	    var byline = [];
	    var date = [];
	    $('h2.headline').each(function(i, element) {
	    	var thisHeadline = $(this).text();
	    	headline.push(thisHeadline);
	    });
	    $('p.summary').each(function(i, element) {
	    	var thisSummary = $(this).text();
	    	summary.push(thisSummary);
	    });
	    $('p.byline').each(function(i, element) {
	    	var thisByline = $(this).text();
	    	byline.push(thisByline);
	    });
	    $('time.dateline').each(function(i, element) {
	    	var thisDate = $(this).text();
	    	date.push(thisDate);
	    });

	    for (i=0; i<headline.length; i++){
	    	var result = {};
			result.title = headline[i];
			result.summary = summary[i];
			result.byline = byline[i];
			result.date = date[i];
			var entry = new Nyt (result);

			entry.save(function(err, doc) {
			  if (err) {
			    console.log(err);
			  } 
			  else {
			    console.log(doc);
			  }
			});
	    }
	});
  res.send("Scrape Complete");
});

app.get('/Nyts', function(req, res){
	Nyt.find({}, function(err, doc){
		if (err){
			console.log(err);
		} 
		else {
			res.json(doc);
		}
	});
});

app.get('/Nyts/:id', function(req, res){
	Nyt.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});

app.post('/Nyts/:id', function(req, res){
	var newNote = new Note(req.body);
	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} 
		else {
			Nyt.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

app.listen(3000, function() {
  console.log('App running on port 3000!');
});