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

class Feed extends Component {
  render() {
    return(
      <div className='ui segment'>
        <div className='ui feed'>
          {this.props.feed.map((ev, index) => {
            return(
              <div key={index} className='event'>
                <div className='label'>
                  <i className='comment outline icon'></i>
                </div>
                <div className='content'>
                  <div className='summary'>
                    {ev}
                    <div className='date'>
                      {ev.date ? ev.date.toString() : 'Today'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Feed.propTypes = {
  feed : PropTypes.array,
};

export default Feed;
