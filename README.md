### How to run

cd into uwb-planner

run npm install

look at package.json for the different run scripts

relevant ones are:

npm run start:sqlite:ephemeral
This one runs with a local sqlite database that any changes you make to it's data will be reset if you kill and restart the program

npm run start:sqlite:persistent
This one is same as last but the changes you make to the data should persist across runs (untested because haven't added any crud operations yet)

npm run start:supabase
This one uses the cloud database for data


### To only run the database locally on sqlite
refer to this file: uwb-planner\src\database\local-sqlite3-running.txt
