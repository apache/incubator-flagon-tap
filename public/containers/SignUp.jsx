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

import { signup } from '../actions';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleSignup() {
    const email = $('input[name=email]').val();
    const password = $('input[name=password]').val();
    this.props.signup(email, password);
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
          <button className='ui teal button' onClick={this.handleSignup}>
            Sign Up
          </button>
          <Link to='/login'>
            <button className='ui right floated teal button'>
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {
  signup
})(Signup);
