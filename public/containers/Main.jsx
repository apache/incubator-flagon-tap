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

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { login, logout } from '../actions';

class Main extends Component {

  buildAuthHeader() {
    const { email, logout } = this.props;

    if (email) {
      return (
        <div className='right menu'>
          <div className='item'>
            <Link to='/apps'>
              {email}
            </Link>
          </div>
          <div className='item' onClick={logout}>
            Logout
          </div>
        </div>
      );
    } else {
      return (
        <div className='right menu'>
          <div className='item'>
            <Link to='/login'>
              Login
            </Link>
          </div>
        </div>
      );
    }
  }

  render () {
    const { children } = this.props;

    const authHeader = this.buildAuthHeader();

    return (
      <div id='main-container'>
        <div className='site-header'>
          <div className='ui teal inverted padded top fixed borderless menu'>
            <div className='ui container'>

              <Link to='/'>
                <h2 className='ui inverted header item'>Tap</h2>
              </Link>

              {authHeader}

            </div>
          </div>
        </div>

        <div id='page-wrapper'>
          {children}
        </div>

        <div className='site-footer'>
          <div className='ui container'>
            <div className='ui footer page teal inverted segment'>
              <div className='ui center aligned container'>
                <div className='footer-text'>Copyright Apache SensSoft 2016</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.node,
  email: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    email: state.user.email,
  };
}

export default connect(mapStateToProps, {
  logout,
})(Main);
