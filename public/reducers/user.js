import { REQUEST_USER, RECEIVE_USER, REQUEST_USER_UPDATE, CONFIRM_USER_UPDATE } from '../constants/ActionTypes';
import merge from 'lodash/merge';

const initialUserState = {
  email : 'test@test.com',
  settings : {
    setting1 : true,
    setting2 : 'hello',
    setting3 : 4,
  },
  orgs : [
    {
      id : 3,
      name : 'Tap',
    },
    {
      id : 2,
      name : 'Distill (fake)',
    }
  ],
  apps : [
    {
      id : 7,
      name : 'Ale',
    },
    {
      id : 1,
      name : 'Stout (fake)',
    },
  ]
};

export default function user (state = initialUserState, action) {
  switch (action.type) {
    case REQUEST_USER:
      return merge({}, state, {});
    case RECEIVE_USER:
      return merge({}, state, action.user);
    case REQUEST_USER_UPDATE:
      return merge({}, state, action.update);
    case CONFIRM_USER_UPDATE:
      return merge({}, state, action.saved);
    default:
      return state;
  }
}
