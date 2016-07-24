import { REQUEST_APP, RECEIVE_APP, REQUEST_APP_UPDATE, CONFIRM_APP_UPDATE, REQUEST_APP_RESULTS, RECEIVE_APP_RESULTS } from '../constants/ActionTypes';

export function fetchApp () {
  return { type : REQUEST_APP };
}

export function receivedApp (app) {
  return { type : RECEIVE_APP, app : app };
}

export function updateApp (update) {
  return { type : REQUEST_APP_UPDATE, update : update };
}

export function confirmAppUpdate (success) {
  return { type : CONFIRM_APP_UPDATE, saved : success };
}

export function fetchAppResults () {
  return { type : REQUEST_APP_RESULTS };
}

export function receivedAppResults (results) {
  return { type : RECEIVE_APP_RESULTS, results : results };
}
