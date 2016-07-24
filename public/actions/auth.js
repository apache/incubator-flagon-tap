import { LOG_IN, LOG_OUT } from '../constants/ActionTypes';

export function logIn () {
  return { type : LOG_IN };
}

export function logOut () {
  return { type : LOG_OUT };
}
