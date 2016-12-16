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

import { login } from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const email = $('input[name=email]').val();
    const password = $('input[name=password]').val();
    this.props.login(email, password);
  }

  render() {
    return (
      <div className='ui text container'>
        <div className='ui form'>
          <div className='field'>
            <input type='text' name='email' placeholder="Email" />
          </div>
          <div className='field'>
            <input type='password' name='password' placeholder="Password" />
          </div>
          <button className='ui teal button' onClick={this.handleLogin}>
            Log In
          </button>
          <Link to='/signup'>
            <button className='ui right floated teal button'>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {
  login
})(Login);
