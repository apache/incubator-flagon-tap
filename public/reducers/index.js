import { combineReducers } from 'redux';

import auth from './auth';
import user from './user';
import org from './org';
import app from './app';

const rootReducer = combineReducers({
  auth,
  user,
  org,
  app
});

export default rootReducer;
