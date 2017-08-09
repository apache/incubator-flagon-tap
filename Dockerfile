# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM python:3.4
MAINTAINER Michelle Beard <msbeard@apache.org>

# Install system wide dependencies
RUN apt-get -yqq update && apt-get -yqq install \
	curl \
	sudo

# Install NodeJS 4.x
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

RUN sudo -E apt-get -yqq install \
	nodejs \
	build-essential

# Set the app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install gulp
RUN npm install -g bower gulp

# Install packages
RUN npm install

# Install TAP requirements
RUN pip install -r requirements.txt

# Add application files
ADD secrets/secret.py /usr/src/app/tap/settings
ADD secrets/neon_counts.js /usr/src/app/public
ADD secrets/neon_graph.js /usr/src/app/public

# Bundle app source
COPY . /usr/src/app

# Run startup script
RUN chmod +x /usr/src/app/wait-for-postgres.sh

# Startup Application
RUN gulp build

# Export port
EXPOSE 8010
