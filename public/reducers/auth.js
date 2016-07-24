import { LOG_IN, LOG_OUT } from '../constants/ActionTypes';
import merge from 'lodash/merge';

const initialAuthState = {
  isLoggedIn : false,
};

export default function auth (state = initialAuthState, action) {
  switch (action.type) {
    case LOG_IN:
      return merge({}, state, { isLoggedIn : true });
    case LOG_OUT:
      return merge({}, state, { isLoggedIn : false });
    default:
      return state;
  }
}
