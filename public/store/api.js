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

import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

const API_ROOT = '';

export const CALL_API = Symbol('CALL_API');

function callApi(apiOpts) {
  const url = API_ROOT + apiOpts.endpoint + '/';
  const method = apiOpts.method || 'GET';

  const headers = {};
  const opts = {
    method,
  };

  if (apiOpts.body) {
    headers['Content-type'] = 'application/x-www-form-urlencoded';
    opts.body = apiOpts.body;
  }

  const authToken = localStorage.getItem('tapToken');
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  opts.headers = new Headers(headers);

  return fetch(url, opts)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    });
}

export default store => next => action => {
  const opts = action[CALL_API];

  if (typeof opts === 'undefined') {
    return next(action);
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const { types, successRedirect } = opts;
  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(opts)
    .then(
      response => {
        next(actionWith({
          type: successType,
          response,
        }));

        if (response.token) {
          localStorage.setItem('tapToken', response.token);
        }

        if (opts.successRedirect) {
          browserHistory.push(opts.successRedirect);
        }
      },
      error => {
        next(actionWith({
          type: failureType,
          error,
        }));
      }
    );
}
