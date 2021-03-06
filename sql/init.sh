#!/usr/bin/env bash

source .env
echo "Creating $DB_NAME database..."
mysql -u "$DB_USER" -p"$DB_PASS" -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"
echo "Initializing database..."
mysql -u "$DB_USER" -p"$DB_PASS" $DB_NAME < sql/init.sql
echo "Database initialized."