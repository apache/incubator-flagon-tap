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

    //console.log("dataset = " + this.props.data);
    //console.log("dataset = " + this.props.data[0].counts);
    //console.log("dataset = " + this.props.data[1].target);
    //console.log("dataset = " + this.props.data[2].types);

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
    var dataSubset = this.props.data; //snarl - for now, use the full dataset without filters
    //var dataSubset = subset(this.props.data, this.props.filters);
    //console.log("counts dataSubset = " + dataSubset);

    // var selectedGroup = this.state.selectedGroup;
    // if (selectedGroup == '') {
    //   selectedGroup = Object.keys(dataSubset)[0];
    // }

    // var selectedActivity = this.state.selectedActivity;
    // //if (selectedActivity == '') {
    //   //selectedActivity = Object.keys(dataSubset[selectedGroup].activities)[0];
    // //}

    // var activity = dataSubset[selectedGroup].activities[selectedActivity];

    return(
      <div className='ui grid'>
        <div className='sixteen wide column'>
          <VerticalBar grouped={this.props.filters.ab} select={this.selectGroup} data={(() => {
            var groupData = [];

            groupData = this.props.data;

            return groupData;
          })()} />
        </div>
      </div>
    );
  }
}

function subset(data, filters) {
  preprocessData(data);

  // var dataSubset = data.filter((p) => {
  //   return (filters.gender === 0 || filters.gender == p.intake_data.demographics.Gender) && (filters.educationlevels.includes(+p.intake_data.education["Most school completed"]));
  // });
  var dataSubset = data; //snarl apply filtered data here

  var logs = {};

  dataSubset.forEach((p) => {
    $.each(p.ot1logs, (id, log) => {
      if (!logs.hasOwnProperty(log.group)) {
        logs[log.group] = {
          group : log.group,
          ot1count : 0,
          //ot2count : 0,
          activities : {},
        };
      }

      if (!logs[log.group].activities.hasOwnProperty(log.id)) {
        logs[log.group].activities[log.id] = {
          id : id,
          ot1count : 0,
          //ot2count : 0,
          name : log.name,
          ele : log.ele,
          group : log.group,
        }
      }

      logs[log.group].ot1count += log.count;
      logs[log.group].activities[log.id].ot1count += log.count;
    });

  });

  return logs;
}

function preprocessData(data) {
  data.forEach(function (p) {
    //excluded ot1 and ot2 preprocessing
  });
}

Counts.propTypes = {
  data : PropTypes.array,
};

export default Counts;
