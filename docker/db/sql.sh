#!/bin/bash

echo "Creating POSTGRES DB FROM ENVIRONMENT"
DB_NAME=tapdb
DB_USER=tapuser
DB_PASS="Dr@p3rUs3r"
DB_SERVICE=postgres

psql -U postgres -c "CREATE USER $DB_USER PASSWORD '$DB_PASS'"
psql -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER"

#localedef -i de_DE -c -f UTF-8 -A /usr/share/locale/locale.alias de_DE.UTF-8
##export LANG=en_US.UTF-8
#locale   # confirm that it shows only en_US.UTF-8 for all settings
# finally, run your opennms installer
#/usr/share/opennms/bin/install -l /usr/local/lib -dis
