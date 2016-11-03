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
MAINTAINER Arthi <demo@apache.org>

# Install system wide dependencies
RUN apt-get -yqq update && apt-get -yqq install \
	curl \
	sudo

# Install NodeJS 4.x
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

RUN sudo -E apt-get -yqq install \
	nodejs \
	build-essential 

# Set the work directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install gulp
RUN npm install -g bower gulp

# Add package.json before adding application files
ADD package.json /usr/src/app
ADD semantic.json /usr/src/app

# Install packages
RUN npm install 

# Add requirements file
ADD requirements.txt /usr/src/app

# Install TAP requirements
RUN pip install -r requirements.txt

# Add application files
ADD . /usr/src/app

# Startup Application
RUN gulp dev

EXPOSE 8000
