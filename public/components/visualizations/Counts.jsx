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

import React, { Component, PropTypes } from 'react';

import VerticalBar from './VerticalBar';
import HorizontalBar from './HorizontalBar';

class Counts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup : '',
      selectedActivity : '',
    };

    this.selectGroup = this.selectGroup.bind(this);
    this.selectActivity = this.selectActivity.bind(this);
  }

  selectGroup(group) {
    this.setState({ selectedGroup : group, selectedActivity : '' });
  }

  selectActivity(activity) {
    this.setState({ selectedActivity : activity });
  }

  render() {
    var dataSubset = subset(this.props.data, this.props.filters);

    var selectedGroup = this.state.selectedGroup;
    if (selectedGroup == '') {
      selectedGroup = Object.keys(dataSubset)[0];
    }

    var selectedActivity = this.state.selectedActivity;
    if (selectedActivity == '') {
      selectedActivity = Object.keys(dataSubset[selectedGroup].activities)[0];
    }

    var activity = dataSubset[selectedGroup].activities[selectedActivity];

    return(
      <div className='ui grid'>
        <div className='sixteen wide column'>
          <VerticalBar grouped={this.props.filters.ab} select={this.selectGroup} data={(() => {
            var groupData = [];

            $.each(dataSubset, (group, logs) => {
              groupData.push({
                id : group,
                selected : (selectedGroup == group),
                ot1 : logs.ot1count,
                ot2 : logs.ot2count,
              });
            });

            return groupData;
          })()} />
        </div>

        <div className='ten wide column'>
          <HorizontalBar grouped={this.props.filters.ab} select={this.selectActivity} data={(() => {
            var activityData = [];

            $.each(dataSubset[selectedGroup].activities, (id, log) => {
              activityData.push({
                id : id,
                name : log.ele,
                selected : (selectedActivity == id),
                ot1 : log.ot1count,
                ot2 : log.ot2count,
              });
            });

            return activityData;
          })()} />
        </div>

        <div className='six wide column'>
          <div id='counts-details' className='ui segment'>
            Activity Details
            <br></br>
            <br></br>
            Name: {activity.name}
            <br></br>
            Element: {activity.ele}
            <br></br>
            Group: {activity.group}
            <br></br>
            OT1: {activity.ot1count}
            <br></br>
            OT2: {activity.ot2count}
          </div>
        </div>
      </div>
    );
  }
}

function subset(data, filters) {
  preprocessData(data);

  var dataSubset = data.filter((p) => {
    return (filters.gender === 0 || filters.gender == p.intake_data.demographics.Gender) && (filters.educationlevels.includes(+p.intake_data.education["Most school completed"]));
  });

  var logs = {};

  dataSubset.forEach((p) => {
    $.each(p.ot1logs, (id, log) => {
      if (!logs.hasOwnProperty(log.group)) {
        logs[log.group] = {
          group : log.group,
          ot1count : 0,
          ot2count : 0,
          activities : {},
        };
      }

      if (!logs[log.group].activities.hasOwnProperty(log.id)) {
        logs[log.group].activities[log.id] = {
          id : id,
          ot1count : 0,
          ot2count : 0,
          name : log.name,
          ele : log.ele,
          group : log.group,
        }
      }

      logs[log.group].ot1count += log.count;
      logs[log.group].activities[log.id].ot1count += log.count;
    });

    $.each(p.ot2logs, (id, log) => {
      if (!logs.hasOwnProperty(log.group)) {
        logs[log.group] = {
          group : log.group,
          ot1count : 0,
          ot2count : 0,
          activities : {},
        };
      }

      if (!logs[log.group].activities.hasOwnProperty(log.id)) {
        logs[log.group].activities[log.id] = {
          id : id,
          ot1count : 0,
          ot2count : 0,
          name : log.name,
          ele : log.ele,
          group : log.group,
        }
      }

      logs[log.group].ot2count += log.count;
      logs[log.group].activities[log.id].ot2count += log.count;
    });
  });

  return logs;
}

function preprocessData(data) {
  data.forEach(function (p) {
    var ot1logs = {};
    var ot2logs = {};

    p.log_data.OT1.logs.log_id.forEach(function (id, i) {
      if (ot1logs.hasOwnProperty(id)) {
        ot1logs[id].count += p.log_data.OT1.logs.count[i];
      } else {
        ot1logs[id] = {
          'id' : id,
          'count' : p.log_data.OT1.logs.count[i],
          'name' : p.log_data.OT1.logs.log_strings[i],
          'ele' : p.log_data.OT1.logs.elementId[i],
          'group' : p.log_data.OT1.logs.elementGroup[i]
        };
      }
    });

    p.log_data.OT2.logs.log_id.forEach(function (id, i) {
      if (ot2logs.hasOwnProperty(id)) {
        ot2logs[id].count += p.log_data.OT2.logs.count[i];
      } else {
        ot2logs[id] = {
          'id' : id,
          'count' : p.log_data.OT2.logs.count[i],
          'name' : p.log_data.OT2.logs.log_strings[i],
          'ele' : p.log_data.OT2.logs.elementId[i],
          'group' : p.log_data.OT2.logs.elementGroup[i]
        };
      }
    });

    p.ot1logs = ot1logs;
    p.ot2logs = ot2logs;

  });
}

Counts.propTypes = {
  data : PropTypes.array,
};

export default Counts;
