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
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { getAppList } from '../actions';
import AppCard from '../components/AppCard';

class AppList extends Component {
  componentDidMount() {
    this.props.getAppList();
  }

  render() {
    const { apps, appIds, isDefault } = this.props;

    const defaultApp = !isDefault ? null : (
      <div>
        <div className='ui header'>
          Example App
        </div>
        <div className='ui list'>
          <div className='item'>
            <Link to='/app/default'>
              <AppCard app={apps.default} />
            </Link>
          </div>
        </div>
      </div>
    );

    return (
      <div className='ui container'>
        {defaultApp}
        <div className='ui header'>
          Your Apps
        </div>
        <div className='ui list'>
          {appIds.map((id) => (
            <div key={id} className='item'>
              <Link to={`/app/${id}`}>
                <AppCard app={apps[id]} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

AppList.propTypes = {
  apps: PropTypes.object.isRequired,
  appIds: PropTypes.array.isRequired,
  isDefault: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    apps: state.apps.apps,
    appIds: state.apps.appIds,
    isDefault: state.apps.apps.hasOwnProperty('default'),
  };
}

export default connect(mapStateToProps, {
  getAppList
})(AppList);
