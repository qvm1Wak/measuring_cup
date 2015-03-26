console.log('server started');

var pg = require('pg');
var express = require('express');
var serveStatic = require('serve-static');
var connectionString = "postgres://postgres:password@172.17.0.2/measuring_cup";
var bodyParser = require('body-parser');

// parse application/json
var app = express();

var ok = require('okay');
app.use(require('express-domain-middleware'));
app.use(serveStatic(__dirname + '/public'));
app.use(bodyParser.json());
app.use(app.router);
app.use(function errorHandler(err, req, res, next) {
  console.log('error on request %d %s %s: %j', process.domain.id, req.method, req.url, err);
  res.send(500, "Something bad happened. :(");
});

app.listen(3000);

app.get('/ingredients/:foodId', function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    var id = req.param('foodId');
    var query = client.query("select b.nutrient_description, a.nutrient_value, b.units from nutrient_data as a join nutrient_definition b on a.nutrient_number = b.nutrient_number where a.food_number = '" + id + "';");

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});

app.get('/foods/', function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    var id = req.param('ingredientId');
    var query = client.query('select food_number, long_description from food_description;');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});
/*
app.get('/recipes/', function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    var id = req.param('ingredientId');
    var query = client.query('select recipe_id, ingredient_id from recipe_ingredients;');
    var query = client.query('select id, name from recipes;');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});

app.post('/recipes/new', function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    var id = req.param('ingredientId');
    var query = client.query('select id, name, ingredients from recipes;');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});
*/
