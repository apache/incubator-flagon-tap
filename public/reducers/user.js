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

import * as ActionTypes from '../actions/ActionTypes';

export default function user (state = {
  email: '',
  loginPending: false,
  loginSuccess: false,
  loginError: false,
  signupPending: false,
  signupSuccess: false,
  signupError: false,
}, action) {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        loginPending: true,
        loginSuccess: false,
      });
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        email: action.email,
        loginPending: false,
        loginSuccess: true,
        loginError: false,
      });
    case ActionTypes.LOGIN_FAILURE:
      return Object.assign({}, state, {
        loginPending: false,
        loginSuccess: false,
        loginError: true,
      });
    case ActionTypes.LOGOUT:
      return Object.assign({}, state, {
        username: '',
        loginSuccess: false,
      });
    case ActionTypes.SIGNUP_REQUEST:
      return Object.assign({}, state, {
        signupPending: true,
        signupSuccess: false,
      });
    case ActionTypes.SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        signupPending: false,
        signupSuccess: true,
        signupError: false,
      });
    case ActionTypes.SIGNUP_FAILURE:
      return Object.assign({}, state, {
        signupPending: false,
        signupSuccess: false,
        signupError: true,
      });
    default:
      return state;
  }
}
