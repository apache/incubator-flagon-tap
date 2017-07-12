FROM python:3.4
MAINTAINER Michelle Beard <msbeard@apache.org>

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
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY . /usr/src

# Install gulp
RUN npm install -g bower gulp

# Install packages
RUN npm install 

# Install TAP requirements
RUN pip install -r requirements.txt

# Startup Application
RUN gulp build

# Export port
EXPOSE 8000
