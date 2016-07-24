import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import Main from './containers/Main';
import Home from './components/Home';
// import Login from './containers/Login';
// import Logout from './containers/Logout';
// import SignUp from './containers/SignUp';
import User from './containers/User';
import UserProfile from './components/UserProfile';
import UserSettings from './components/UserSettings';
import Org from './containers/Org';
import OrgProfile from './components/OrgProfile';
import OrgSettings from './components/OrgSettings';
// import OrgNew from './containers/OrgNew';
import App from './containers/App';
import AppProfile from './components/AppProfile';
import AppSettings from './components/AppSettings';
import AppResults from './components/AppResults';
// import AppNew from './containers/AppNew';

const store = configureStore();

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={Main}>
        <IndexRoute component={Home} />

        {
        // <Route path='login' component={Login} />
        // <Route path='logout' component={Logout} />
        // <Route path='signup' component={SignUp} />
        }

        <Route path='user' component={User}>
          <IndexRoute component={UserProfile} />
          <Route path='settings' component={UserSettings} />
        </Route>

        <Route path='org/:id' component={Org}>
          <IndexRoute component={OrgProfile} />
          <Route path='settings' component={OrgSettings} />
        </Route>

        <Route path='app/:id' component={App}>
          <IndexRoute component={AppProfile} />
          <Route path='settings' component={AppSettings} />
          <Route path='results' component={AppResults} />
        </Route>

        {
        // <Route path='org/new' component={OrgNew} />
        // <Route path='app/new' component={AppNew} />
        }
      </Route>
    </Router>
  </Provider>
), document.getElementById('react-container'))
