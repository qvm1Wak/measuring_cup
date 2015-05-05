To install:

```
npm install -g jspm
npm install
jspm install
```

To run
```
npm start
```

The site should be live on localhost:3000


# Running the site from Docker
You can use the webapp image to avoid installing Node, Ruby, SASS, jspm and the other npm modules.

Add the following script to your bashrc as a convenience.
```
webapp() { sudo docker-compose run --rm web "$@"; }
```

Get the docker-compose.yml and nodejs Dockerfile from a project maintainer.
The yml file has the database credentials and service definitions.

Initialize the data containers with the same image as the ones they're linked to (for uid, gid).
```
sudo docker run -d -v /var/lib/postgresql/data --name measuring_cup_db-data postgres echo "Data Container"
sudo docker run -d -v ~/projects/me/measuring_cup/app:/app --name measuring_cup_app-data debian:latest
```

Start the services
```
sudo docker-compose up -d
```

Upgrade the database
```
webapp pg-migrate up
```

Create a new migration
```
webapp pg-migrate <migration_name>
```

Get the address of the db service
```
sudo docker ps -a
dip measuringcup_web_db_X
```

Connect to the database from the docker host
```
export PGPASSWORD='password'
psql -h 172.17.0.93 -U postgres
```

Upload data files to the database from the docker host
```
uploading the data files to postgres with the correct encoding
psql -U postgres -h 172.17.0.2 -d postgres -c "\copy food_description FROM 'FOOD_DES.txt' (FORMAT CSV, DELIMITER '^', QUOTE '~', ENCODING 'latin1');"
psql -U postgres -h 172.17.0.2 -d postgres -c "\copy nutrient_definition FROM 'NUTR_DEF.txt' (FORMAT CSV, DELIMITER '^', QUOTE '~', ENCODING 'latin1');"
psql -U postgres -h 172.17.0.2 -d postgres -c "\copy nutrient_data FROM 'NUT_DATA.txt' (FORMAT CSV, DELIMITER '^', QUOTE '~', ENCODING 'latin1');"
```
See: https://www.ars.usda.gov/SP2UserFiles/Place/80400525/Data/SR27/sr27_doc.pdf

Start the server in the container's nsenter mode,
allowing for fast server restarts and without losing our IP address.
```
webapp /bin/bash
npm start
```

Watch style changes
```
webapp sass --watch public/styles/styles.scss:public/styles/styles.css
```

Download data files
```
wget https://www.ars.usda.gov/SP2UserFiles/Place/12354500/Data/SR27/dnload/sr27asc.zip
unzip sr27asc.zip
```

Sample query
```
select a.nutrient_number, b.nutrient_description, a.nutrient_value, b.units from nutrient_data as a join nutrient_definition b on a.nutrient_number = b.nutrient_number where a.food_number = '01001';
```
