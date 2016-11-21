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

class Settings extends Component {
  componentDidMount() {
    let $settingsControls = $('#settings-menu .item');
    $settingsControls.on('click', (e) => {
      $settingsControls.removeClass('active');
      $(e.target).addClass('active');
    });
  }

  render() {
    const { settings } = this.props;

    return (
      <div className='ui grid'>
        <div className='four wide column'>
          <div id='settings-menu' className='ui vertical fluid tabular menu'>
            <a className='item active'>
              Account
            </a>
            <a className='item'>
              Notifications
            </a>
            <a className='item'>
              Organizations
            </a>
          </div>
        </div>

        <div className='twelve wide stretched column'>
          <div className='ui segment'>
            <ul>
              {Object.keys(settings).map((setting, index) => {
                return (
                  <li key={index}>
                    {setting}, {settings[setting].toString()}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  settings : PropTypes.object,
};

export default Settings;
