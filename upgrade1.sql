/*
# getting along with docker
sudo docker run --name node-postgres -e POSTGRES_PASSWORD=password -dpostgres
sudo docker run -it --volumes-from ac5 measuringcup_web:latest /bin/bash
sudo docker exec -it a5c npm start
dip node-postgres

# watching style changes (from within a docker container)
sass --watch public/styles/styles.scss:public/styles/styles.css

# data files
# https://www.ars.usda.gov/SP2UserFiles/Place/12354500/Data/SR27/dnload/sr27asc.zip
# https://www.ars.usda.gov/SP2UserFiles/Place/80400525/Data/SR27/sr27_doc.pdf
# http://stackoverflow.com/questions/24792638/how-can-i-import-data-from-ascii-iso-iec-8859-1-to-my-rails-pgsql-database

# uploading the data files to postgres with the correct encoding
psql -U postgres -h 172.17.0.2 -d measuring_cup -c "\copy food_description FROM 'FOOD_DES.txt' (FORMAT CSV, DELIMITER '^', QUOTE '~', ENCODING 'latin1');"

psql -U postgres -h 172.17.0.2 -d measuring_cup -c "\copy nutrient_definition FROM 'NUTR_DEF.txt' (FORMAT CSV, DELIMITER '^', QUOTE '~', ENCODING 'latin1');"

psql -U postgres -h 172.17.0.2 -d measuring_cup -c "\copy nutrient_data FROM 'NUT_DATA.txt' (FORMAT CSV, DELIMITER '^', QUOTE '~', ENCODING 'latin1');"

# sample query
select a.nutrient_number, b.nutrient_description, a.nutrient_value, b.units from nutrient_data as a join nutrient_definition b on a.nutrient_number = b.nutrient_number where a.food_number = '01001';
*/

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

CREATE TABLE nutrient_definition (
    nutrient_number varchar(3) PRIMARY KEY NOT NULL,
    units varchar(7) NOT NULL,
    tagname varchar(20),
    nutrient_description varchar(60) NOT NULL,
    decimal_places_value varchar(1) NOT NULL,
    sort_order smallint NOT NULL
);

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
