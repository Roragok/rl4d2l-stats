#!/usr/bin/env bash

source .env
mysql $DB_NAME < sql/storedprocs/index.sql
mysql $DB_NAME < sql/migrations/1565176137.sql