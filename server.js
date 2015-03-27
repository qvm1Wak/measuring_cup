console.log('server started');

var pg = require('pg');
var express = require('express');
var serveStatic = require('serve-static');
var connectionString = "postgres://postgres:password@172.17.0.2/measuring_cup";
var bodyParser = require('body-parser');
var relevancy = require('relevancy');
var ok = require('okay');

// parse application/json
var app = express();

app.use(require('express-domain-middleware'));
app.use(serveStatic(__dirname + '/public'));
app.use(bodyParser.json());
app.use(app.router);
app.use(function errorHandler(err, req, res, next) {
  console.log('error on request %d %s %s: %j', process.domain.id, req.method, req.url, err);
  res.send(500, "Something bad happened. :(");
});

app.listen(3000);

app.get('/ingredients/:foodIds', function(req, res) {
  var results = {};
  pg.connect(connectionString, function(err, client, done) {
    var ids = req.param('foodIds'); // TODO sql injection
    ids = "'" + ids.split(',').join("','") + "'";
    var queryString = "SELECT a.food_number, a.long_description, b.nutrient_description, a.nutrient_value, b.units FROM nutrient_data as a JOIN nutrient_definition b on a.nutrient_number = b.nutrient_number WHERE a.food_number in (" + ids + ");"; //" + ids + ");";
    var query = client.query(queryString);
    query.on('row', function(row) {
      results[row.food_number] = results[row.food_number] || { food_number: row.food_number };
      results[row.food_number][row.nutrient_description] = {
        value: row.nutrient_value,
        units: row.units
      };
    });

    query.on('end', function() {
      client.end();
      var values = Object.keys(results).map(function (key) { return results[key]; });
      return res.json(values);
    });

    if(err) {
      console.log(err);
    }
  });
});

app.get('/foods/:foodName', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    var name = req.param('foodName');
    var results = [];
    var query = client.query('select food_number, long_description, foodgroup_code from food_description;');
    var lowest = {relevancy: -Infinity};
    var sortRegex = relevancy.defaultSorter._generateSubjectRegex(name);
    query.on('row', function(row) {      
      var i = null;
      row.relevancy = relevancy.defaultSorter._calcWeight(row.long_description, sortRegex, name);
      // row.relevancy = relevancy.weight(name, row.long_description);
      if (row.relevancy < lowest.relevancy && results.length === 10) return;
      
      i = results.reduce(function (memo, result, idx) {
        if (memo === null && (!result || row.relevancy > result.relevancy)) {
          memo = idx;
        }
        return memo;
      }, null);
      results.splice(i === null ? results.length - 1 : i, 0, row);
      lowest = results[results.length -1];
      if (results.length > 10) results = results.slice(0, 10);
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
