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
// limitations under the License.s

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getAppDetails } from '../actions';

class App extends Component {
  componentDidMount() {
    this.props.getAppDetails(this.props.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.props.getAppDetails(this.props.params.id);
    }
  }

  render() {
    const { children, params, apps } = this.props;

    const id = params.id;
    const app = apps[id];

    console.log(id, app);

    return(
        <div>
          {React.cloneElement(children, {
            id,
            app,
          })}
        </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.object.isRequired,
  apps: PropTypes.object.isRequired,
  getAppDetails: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    apps: state.apps.apps,
  };
}

export default connect(mapStateToProps, {
  getAppDetails,
})(App);
