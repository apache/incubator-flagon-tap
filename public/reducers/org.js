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

import { REQUEST_ORG, RECEIVE_ORG, REQUEST_ORG_UPDATE, CONFIRM_ORG_UPDATE } from '../constants/ActionTypes';
import merge from 'lodash/merge';

const initialOrgState = {
  id : 3,
  name : 'Tap',
  description : 'The Tap Group',
  settings : {
    setting1 : true
  },
  users : [
    {
      id : 1,
      email : 'test@test.com'
    },
    {
      id : 2,
      email : 'test2@test.com'
    }
  ],
  apps : [
    {
      id : 7,
      name : 'Ale'
    },
    {
      id : 1,
      name : 'Stout (fake)'
    }
  ]
};

export default function org (state = initialOrgState, action) {
  switch (action.type) {
    case REQUEST_ORG:
      return merge({}, state, {});
    case RECEIVE_ORG:
      return merge({}, state. action.org);
    case REQUEST_ORG_UPDATE:
      return merge({}, state, action.update);
    case CONFIRM_ORG_UPDATE:
      return merge({}, state, action.saved);
    default:
      return state;
  }
}
