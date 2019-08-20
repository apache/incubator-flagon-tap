# Apache Flagon TAP

####NOTE: This project is not currently maintained and will be refactored. If you are interested in TAP, join the discussion on our [dev list](dev-subscribe@flagon.incubator.apache.org). 

Apache TAP is part of the Flagon software stack. It's a React based app with a Django backend that allows you to access your applications' usage data via custom D3 visualizations.



## Configure TAP

To run TAP via Docker, you'll have to include a secret.py file like the one below:

```python
"""
Secret Django settings for tap project.
"""

# SECURITY WARNING: keep the secret key used in production secret!
MY_SECRET_KEY = '<yoursecretkey>'
MY_DB_NAME = 'tapdb'
MY_DB_USER = 'tapuser'
MY_DB_PASSWORD = '<dbpassword>'
MY_DB_HOST = 'db'

MY_EMAIL_PASSWORD =''
ADMIN_EMAILS = ()

```

## Install and Run TAP on Docker Compose

1. From the project directory, build the TAP and its dependencies docker images

```
$ docker-compose build
```

2. Start up TAP and related images

```
$ docker-compose up
```

3. Visit TAP on localhost:8000

4. To stop services, shut down

```
$ docker-compose down
```




## Contributing

Contributions are welcome!  Simply submit an issue report for problems you encounter or a pull request for your feature or bug fix.  The core team will review it and work with you to incorporate.

## License

Copyright 2016 The Charles Stark Draper Laboratory, Inc.

TAP is released under the Apache v2.0 License.  See the LICENSE file for more information.  