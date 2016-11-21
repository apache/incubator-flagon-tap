// Licensed to the Apache Software Foundation (ASF) under one or more
// contributor license agreements.  See the NOTICE file distributed with
// this work for additional information regarding copyright ownership.
// The ASF licenses this file to You under the Apache License, Version 2.0
// (the "License"); you may not use this file except in compliance with
// the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import Main from './containers/Main';
import Home from './components/Home';
import Login from './containers/Login';
// import Logout from './containers/Logout';
import SignUp from './containers/SignUp';
// import User from './containers/User';
// import UserProfile from './components/UserProfile';
// import UserSettings from './components/UserSettings';
// import Org from './containers/Org';
// import OrgProfile from './components/OrgProfile';
// import OrgSettings from './components/OrgSettings';
// import OrgNew from './containers/OrgNew';
import App from './containers/App';
import AppList from './containers/AppList';
// import AppProfile from './components/AppProfile';
// import AppSettings from './components/AppSettings';
import AppResults from './components/AppResults';
// import AppNew from './containers/AppNew';

const store = configureStore();

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={Main}>
        <IndexRoute component={Home} />

        <Route path='login' component={Login} />
        <Route path='signup' component={SignUp} />

        <Route path='apps' component={AppList} />

        <Route path='app' component={App}>
          <Route path=':id' component={AppResults} />
          {
          // <IndexRoute component={AppProfile} />
          // <Route path='settings' component={AppSettings} />
          // <Route path='results' component={AppResults} />
          }
        </Route>

        {
        // <Route path='logout' component={Logout} />

        // <Route path='org/:id' component={Org}>
        //   <IndexRoute component={OrgProfile} />
        //   <Route path='settings' component={OrgSettings} />
        // </Route>


        // <Route path='org/new' component={OrgNew} />
        // <Route path='app/new' component={AppNew} />
        }
      </Route>
    </Router>
  </Provider>
), document.getElementById('react-container'))
