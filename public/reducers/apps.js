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

// If default/example app data is provided, fill in file paths here:
const defaultAvailable = true;
const defaultApp = defaultAvailable ? {
  name: 'Neon',
  id: 'default',
  results: {
    counts: require('../neon_counts.js').default,
    graph: require('../neon_graph.js').default,
  },
} : {};


export default function apps (state = {
  appIds: [],
  apps: {
    default: defaultApp,
  },
  listPending: false,
  listSuccess: false,
  listError: false,
  detailsPending: false,
  detailsSuccess: false,
  detailsError: false,
}, action) {
  switch (action.type) {
    case ActionTypes.APP_LIST_REQUEST:
      return Object.assign({}, state, {
        listPending: true,
        listSuccess: false,
      });
    case ActionTypes.APP_LIST_SUCCESS: {
      const normalizedApps = {};
      action.response.forEach((a) => {
        normalizedApps[a.id] = a;
      });

      return Object.assign({}, state, {
        apps: Object.assign({}, state.apps, normalizedApps),
        listPending: false,
        listSuccess: true,
        listError: false,
      });
    }
    case ActionTypes.APP_LIST_FAILURE:
      return Object.assign({}, state, {
        listPending: false,
        listSuccess: false,
        listError: true,
      });
    case ActionTypes.APP_DETAILS_REQUEST:
      return Object.assign({}, state, {
        detailsPending: true,
        detailsSuccess: false,
      });
    case ActionTypes.APP_DETAILS_SUCCESS: {
      return Object.assign({}, state, {
        apps: Object.assign({}, state.apps, {
          [action.appId]: Object.assign({}, state.apps[action.appId], {
            results: {
              counts: [],
              graph: action.response,
            },
          }),
        }),
        detailsPending: false,
        detailsSuccess: true,
        detailsError: false,
      });
    }
    case ActionTypes.APP_DETAILS_FAILURE:
      return Object.assign({}, state, {
        detailsPending: false,
        detailsSuccess: false,
        detailsError: true,
      });
    default:
      return state;
  }
}
