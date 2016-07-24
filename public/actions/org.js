import { REQUEST_ORG, RECEIVE_ORG, REQUEST_ORG_UPDATE, CONFIRM_ORG_UPDATE } from '../constants/ActionTypes';

export function fetchOrg () {
  return { type : REQUEST_ORG };
}

export function receivedOrg (org) {
  return { type : RECEIVE_ORG, org : org };
}

export function updateOrg (update) {
  return { type : REQUEST_ORG_UPDATE, update : update };
}

export function confirmOrgUpdate (success) {
  return { type : CONFIRM_ORG_UPDATE, saved : success };
}
