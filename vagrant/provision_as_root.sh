# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at

#   http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#!/bin/bash

date >> /etc/vagrant_provisioned_at

# PostgreSQL server
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update

sudo apt-get install -y postgresql-9.5 postgresql-contrib-9.5 postgresql-server-dev-9.5 libpq-dev
PGSQL_DB_PASSWORD="Dr@p3rUs3r"
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
