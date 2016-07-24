import { REQUEST_USER, RECEIVE_USER, REQUEST_USER_UPDATE, CONFIRM_USER_UPDATE } from '../constants/ActionTypes';

export function fetchUser () {
  return { type : REQUEST_USER };
}

export function receivedUser (user) {
  return { type : RECEIVE_USER, user : user };
}

export function updateUser (update) {
  return { type : REQUEST_USER_UPDATE, update : update };
}

export function confirmUserUpdate (success) {
  return { type : CONFIRM_USER_UPDATE, saved : success };
}
