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
BASHRC="/home/vagrant/.bashrc"
PROFILE="/home/vagrant/.profile"

sed -i 's/#force_color_prompt/force_color_prompt/' $BASHRC

# Django
cd /vagrant
echo "Installing Python Tool and Django"
CMD="source /home/vagrant/tappy3/bin/activate"
$CMD
pip install --upgrade pip
pip install --upgrade setuptools
#pip install --upgrade pip-tools
#pip-sync
#pip install django psycopg2 djangorestframework
pip install -r /vagrant/requirements.txt
deactivate
grep -q -F "$CMD" $BASHRC || echo "$CMD" >> $BASHRC
cd ~
echo "Done"

# NodeJS via nvm
if [ ! -d /home/vagrant/.nvm ]; then
    echo "Installing Node ..."
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
    CMD="source /home/vagrant/.nvm/nvm.sh"
    grep -q -F "$CMD" $PROFILE || echo "$CMD" >> $PROFILE
    source $PROFILE
    nvm install 4.4.5 > /dev/null 2>&1
    nvm alias default 4.4.5
    npm install -g bower gulp
else
    echo "Node is already installed."
fi
echo "Done."

# package.json
# cd /vagrant
# if [ ! -d /vagrant/node_modules ]; then
#     echo "Installing Node packages ..."
#     npm install
# else
#     echo "Node packages are already installed."
# fi
# cd ~
# echo "Done."

# bower.json
# cd /vagrant
# if [ ! -d /vagrant/static/js/components ]; then
#     echo "Installing Bower packages ..."
#     bower install
# else
#     echo "Bower packages are already installed."
# fi
# cd ~
# echo "Done."

# tap/settings.py
# echo "Restoring Django tap/settings.py ..."
# if [ ! -f /vagrant/tap/settings.py ]; then
#     cp /vagrant/vagrant/settings.py /vagrant/tap/settings.py
# fi
# echo "Done."

# secret.py
echo "Restoring Django secret.py ..."
if [ ! -f /vagrant/secret.py ]; then
    cp /vagrant/vagrant/secret.py /vagrant/secret.py
fi
echo "Done."
