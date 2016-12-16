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

import React, { Component } from 'react';

export default class Home extends Component {
  render () {
    return (
      <div id='homepage-container'>

        <div id='main-masthead' className='ui masthead center aligned teal inverted vertical segment'>
          <h1 className='ui header'>Tap</h1>
          <h2 className='ui header'>Registration and Visualization Portal</h2>
        </div>

        <div className="ui container">

          <div className="ui center aligned vertical very padded basic page segment">

            <div className="ui large header">How It Works</div>

            <div className="ui center aligned equal width stackable grid">

              <div className="stackable column">
                <i className="huge red code icon"></i>
                <div className="ui medium header">1. Register your app</div>
              </div>

              <div className="stackable column">
                <i className="huge green record icon"></i>
                <div className="ui medium header">2. Instrument your app</div>
              </div>

              <div className="stackable column">
                <i className="huge blue bar chart icon"></i>
                <div className="ui medium header">3. See your results</div>
              </div>

            </div>

          </div>

          <div className="ui divider"></div>

          <div className="ui center aligned vertical very padded basic page segment">

            <div className="ui large header">Deploying Tap</div>

            <p>
              Tap is a React app driven by a Django back end.
            </p>

          </div>

          <div className="ui divider"></div>

          <div className="ui center aligned vertical very padded basic page segment">

            <div className="ui large header">About Tap</div>

            <p>
              Tap is developed at <a href="http://www.draper.com">Draper</a> as part of the Software as a Sensor&trade; suite of products.
              <br></br>
              It's released under the Apache v2.0 License.
            </p>

          </div>

        </div>


      </div>
    );
  }
}
