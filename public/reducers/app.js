import { REQUEST_APP, RECEIVE_APP, REQUEST_APP_UPDATE, CONFIRM_APP_UPDATE, REQUEST_APP_RESULTS, RECEIVE_APP_RESULTS } from '../constants/ActionTypes';
import merge from 'lodash/merge';

import graphData from '../neon_graph.js';
import countsData from '../neon_counts.js';

const initialAppState = {
  id : 7,
  name : 'Ale',
  settings : {
    setting1 : 'a setting',
  },
  users : [
    {
      id : 1,
      email : 'test@test.com'
    },
    {
      id : 2,
      email : 'test2@test.com'
    },
  ],
  results : {
    counts : countsData,
    // counts : [
    //   {
    //     group : 'map',
    //     activities : [
    //       {
    //         id : 'zoom',
    //         count : 100,
    //       },
    //       {
    //         id : 'pan',
    //         count : 27,
    //       },
    //       {
    //         id : 'resize',
    //         count : 74,
    //       },
    //     ]
    //   },
    //   {
    //     group : 'linechart',
    //     activities : [
    //       {
    //         id : 'tooltip',
    //         count : 51,
    //       },
    //       {
    //         id : 'select',
    //         count : 88,
    //       },
    //       {
    //         id : 'resize',
    //         count : 12,
    //       },
    //     ]
    //   },
    //   {
    //     group : 'table',
    //     activities : [
    //       {
    //         id : 'reorder',
    //         count : 11,
    //       },
    //       {
    //         id : 'resize',
    //         count : 16,
    //       },
    //       {
    //         id : 'filter',
    //         count : 67,
    //       },
    //     ]
    //   },
    // ],
    graph : graphData,
  },
};

export default function app (state = initialAppState, action) {
  switch (action.type) {
    case REQUEST_APP:
      return merge({}, state, {});
    case RECEIVE_APP:
      return merge({}, state, action.app);
    case REQUEST_APP_UPDATE:
      return merge({}, state, action.update);
    case CONFIRM_APP_UPDATE:
      return merge({}, state, action.saved);
    case REQUEST_APP_RESULTS:
      return merge({}, state, {});
    case RECEIVE_APP_RESULTS:
      return merge({}, state, action.results);
    default:
      return state;
  }
}
