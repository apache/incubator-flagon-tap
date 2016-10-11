#!/bin/bash

# Restore Django PostgreSQL database
# tapadmin, tapadmin@draper.com, Dr@perAdm1n!
echo "Restoring Django database ..."
sudo -u postgres psql tapdb < /vagrant/vagrant/sql/appmgr.sql > /dev/null 2>&1
echo "Done."


