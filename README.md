# acs-postgres-11-15

- Creates a Postgres database of American Community Survey data from the 5 year 2011-2015 dataset.
- Add PostGIS capability and current TIGER geography for your database.
- Access your data with an API that returns JSON, CSV, or GEOJSON

## Setup

```
git clone https://github.com/royhobbstn/acs-postgres-11-15.git

npm install
```

IMPORTANT:  Manually edit the ```connection.json``` file with your postgres database connection credentials before proceeding further.

## Step 1

To create your database:

```
node acs-2-postgres -s de,ne
```

Where de,ne are an example of the states you would like to include in your database. Make sure the state abbreviations are in lower case, and do not include a comma between them.  If you would like all states, use ```-s all``` (this will take a seriously long amount of time, beware.)

## Step 2

To add postgis and geographic data to your database:

```
node geo-2-postgis.js
```

Geography for all states and geographic levels will be added (sorry, at this time there is no capability for selecting which state geography you would like to use.)

Note: you must have a postgres installation with postgis already installed for this step to work.

## Step 3

To start the api application:

```
node acs-api.js
```

-------

Examples:

