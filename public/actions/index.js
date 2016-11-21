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

import * as ActionTypes from './ActionTypes';
import { CALL_API } from '../store/api';

export function login(email, password) {
  return {
    [CALL_API]: {
      endpoint: '/app_mgr/login',
      types: [
        ActionTypes.LOGIN_REQUEST,
        ActionTypes.LOGIN_SUCCESS,
        ActionTypes.LOGIN_FAILURE,
      ],
      body: $.param({
        email,
        password,
      }),
      method: 'POST',
      successRedirect: '/apps',
    },
    email,
  };
}

export function logout() {
  localStorage.removeItem('tapToken');
}

export function signup(email, password) {
  return {
    [CALL_API]: {
      endpoint: '/app_mgr/register',
      types: [
        ActionTypes.SIGNUP_REQUEST,
        ActionTypes.SIGNUP_SUCCESS,
        ActionTypes.SIGNUP_FAILURE,
      ],
      body: $.param({
        email,
        password,
      }),
      method: 'POST',
      successRedirect: '/apps',
    },
  };
}

export function getAppList() {
  return {
    [CALL_API]: {
      endpoint: 'app_mgr/apps',
      types: [
        ActionTypes.APP_LIST_REQUEST,
        ActionTypes.APP_LIST_SUCCESS,
        ActionTypes.APP_LIST_FAILURE,
      ],
    },
  };
}

export function getAppDetails(appId) {
  return {
    [CALL_API]: {
      endpoint: `app_mgr/appresults/${appId}/graph`,
      types: [
        ActionTypes.APP_DETAILS_REQUEST,
        ActionTypes.APP_DETAILS_SUCCESS,
        ActionTypes.APP_DETAILS_FAILURE,
      ],
    },
    appId,
  };
}
