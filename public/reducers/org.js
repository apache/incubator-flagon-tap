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
