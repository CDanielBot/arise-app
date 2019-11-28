# Backend API

Backend API

The server is running on port 3001 by default.

To run the server in dev mode (with watchers on code changes) do: npm run watch

To compile the code and start without watchers, do: npm start

To add database migration script:

db-migrate create {migration_name} --sql-file --env dev --config ./db/database.json --migrations-dir ./db/upgrades --verbose

Then in db/migrations/sql/{timestamp-migration_name.sql} you should place your sql code to run at migrationg time


To run database migrations scripts:

DEV:

db-migrate up --env dev --config ./db/database.json --migrations-dir ./db/upgrades --verbose

db-migrate down --env dev --config ./db/database.json --migrations-dir ./db/upgrades --verbose


TEST:

db-migrate up --env test --config ./db/database.json --migrations-dir ./db/schema --verbose
db-migrate up --env test --config ./db/database.json --migrations-dir ./db/upgrades --verbose

db-migrate down --env test --config ./db/database.json --migrations-dir ./db/upgrades --verbose
db-migrate down --env test --config ./db/database.json --migrations-dir ./db/schema --verbose