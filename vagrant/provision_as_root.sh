#!/bin/bash

date >> /etc/vagrant_provisioned_at

# PostgreSQL server
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update

sudo apt-get install -y postgresql-9.5 postgresql-contrib-9.5 postgresql-server-dev-9.5 libpq-dev
PGSQL_DB_PASSWORD="Dr@perUs3r!"
sudo -u postgres psql -c "CREATE DATABASE tapdb"
sudo -u postgres psql -c "CREATE USER tapuser WITH PASSWORD '$PGSQL_DB_PASSWORD'"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tapdb TO tapuser"

# Essentials
#sudo apt-get update -q
echo "Installing Essentials ..."
sudo apt-get install -y git build-essential libssl-dev
echo "Done"

# Python
sudo apt-get install -y python-pip python-dev python3-dev 
#sudo pip install virtualenv virtualenvwrapper

echo "Installing Python virtualenv ..."
sudo pip install --upgrade virtualenv

virtualenv --python=$(which python3) /home/vagrant/tappy3
sudo chown -hR vagrant:vagrant /home/vagrant/tappy3
echo "Done."

# Restart services
service postgresql restart
