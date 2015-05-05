var multiline = require('multiline');

exports.up = function(pgm, run) {
  var sql = multiline(function() {/*
    CREATE TABLE food_description (
      food_number varchar(5) NOT NULL PRIMARY KEY,
      foodgroup_code varchar(4) NOT NULL,
      long_description varchar(200) NOT NULL,
      short_description varchar(60) NOT NULL,
      common_name varchar(100),
      manufacturer_name varchar(65),
      has_nutrient_survey varchar(1),
      refuse_description varchar(135),
      refuse_percent smallint,
      scientific_name varchar(65),
      nitrogen_factor NUMERIC(4,2),
      pro_factor NUMERIC(4,2),
      fat_factor NUMERIC(4,2),
      carbohydrate_factor NUMERIC(4,2)
    );
  */});
  pgm.sql(sql);

  sql = multiline(function() {/*
    CREATE TABLE nutrient_definition (
      nutrient_number varchar(3) PRIMARY KEY NOT NULL,
      units varchar(7) NOT NULL,
      tagname varchar(20),
      nutrient_description varchar(60) NOT NULL,
      decimal_places_value varchar(1) NOT NULL,
      sort_order smallint NOT NULL
    );
  */});
  pgm.sql(sql);

  sql = multiline(function() {/*
    CREATE TABLE nutrient_data (
      food_number varchar(5) NOT NULL REFERENCES food_description(food_number),
      nutrient_number varchar(3) NOT NULL REFERENCES nutrient_definition(nutrient_number),
      nutrient_value NUMERIC(9,3) NOT NULL,
      number_datapoints smallint NOT NULL,
      standard_error NUMERIC(9,3),
      source_code varchar(2) NOT NULL,
      derivation_code varchar(4),
      reference_food_number varchar(5),
      added_nutrients varchar(1),
      number_studies smallint,
      min NUMERIC(9,3),
      max NUMERIC(9,3),
      degrees_of_freedom smallint,
      lower_error_bound NUMERIC(9,3),
      upper_error_bound NUMERIC(9,3),
      statistical_comments varchar(10),
      add_or_modified_date varchar(10),
      confidence_code varchar(1)
    );
  */});
  pgm.sql(sql);

  run();
};

exports.down = function(pgm, run) {
    pgm.dropTable('food_description');
    pgm.dropTable('nutrient_definition');
    pgm.dropTable('nutrient_data');
    run();
};
