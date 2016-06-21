#!/bin/bash
BASHRC="/home/vagrant/.bashrc"
PROFILE="/home/vagrant/.profile"

sed -i 's/#force_color_prompt/force_color_prompt/' $BASHRC

# Django
echo "Installing Python Tool and Django"
CMD="source /home/vagrant/tappy3/bin/activate"
$CMD
pip install --upgrade pip
pip install --upgrade setuptools
#pip install --upgrade pip-tools
#pip-sync
pip install django psycopg2 djangorestframework
deactivate

grep -q -F "$CMD" $BASHRC || echo "$CMD" >> $BASHRC
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

# tap/settings.py
echo "Restoring Django tap/settings.py ..."
if [ ! -f /vagrant/tap/settings.py ]; then
    cp /vagrant/vagrant/settings.py /vagrant/tap/settings.py
fi
echo "Done."


