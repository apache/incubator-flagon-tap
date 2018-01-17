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
import axios from 'axios';

import Counts from './visualizations/Counts';
import SankeyPlot from './visualizations/SankeyPlot';

const DISTILL_URL = require('../../secrets/senssoftconfig').default.distill_url;

class AppResults extends Component {
  constructor(props) {    
    super(props);

    this.state = {
      result : 'counts',
      metric : '',
      minpathlength : 2,
      maxpathlength : 10,
      starttime : 'now-15d',
      endtime : 'now',
      ab : false,
      graphAb : false,
      includedTargetQuery : '',
    };
  }

  componentDidMount() {
    this.getInitialAppResults();

    $('.ui.radio.checkbox').checkbox({
      onChange: () => {
        this.updateResultParameters({ metric: $('input[name=metric]:checked').val() });
        console.log("metric updated");
      },
    });

    $('.ui.field input').on('change', () => {
      const minpathlength = $('input[name=min-path-length]').val();
      const maxpathlength = $('input[name=max-path-length]').val();
      const starttime = $('input[name=start-time]').val();
      const endtime = $('input[name=end-time]').val();
      
      this.updateResultParameters({
        minpathlength,
        maxpathlength,
        starttime,
        endtime,
      });

      console.log("text field updated");
    });
  }

  updateResultParameters(stateChanges, query = '', depth = 1) {
    const nextState = Object.assign({}, this.state, stateChanges);

    let url = `${DISTILL_URL}?size=250&event=${nextState.metric}&`;
    if (nextState.starttime) {
      url += `from=${encodeURIComponent(nextState.starttime)}&`;
    }
    if (nextState.endtime) {
      url += `to=${encodeURIComponent(nextState.endtime)}&`;
    }
    if (nextState.minpathlength) {
      url += `minpathlength=${encodeURIComponent(nextState.minpathlength)}&`;
    }
    if (nextState.maxpathlength) {
      url += `maxpathlength=${encodeURIComponent(nextState.maxpathlength)}&`;
    }
    if (query) {
      url += `target_in=${query}&`;
    }

    this.setState(nextState);

    const requestHandler = (response) => {
      console.log(url);
      console.log("RESPONSE DATA FROM DISTILL");
      console.log(response.data);

      const allTargets = getAllTargets(response.data.histogram);

      const includedTargetQuery = defineIncludedTargets(allTargets);
      const excludedTargetQuery = defineExcludedTargets(allTargets);

      return new Promise((resolve) => {
        this.setState({ includedTargetQuery }, () => {
          this.props.app.results.counts = response.data.histogram;
          this.props.app.results.sankey = {
            nodes : response.data.nodes, 
            links : response.data.links,
          };
          this.props.app.results.allTargets = allTargets;

          this.forceUpdate();
          resolve();
        });
      });
    };

    if (!query && depth) {
      return axios.get(url)
        .then(requestHandler)
        .then(() => this.updateResultParameters({}, this.state.includedTargetQuery, depth - 1))
        .catch((e) => {
          console.error(e);
        });
    }

    return axios.get(url)
      .then(requestHandler)
      .catch((e) => {
        console.error(e);
      });
  }

getInitialAppResults() {
  const { endtime, includedTargetQuery, maxpathlength, minpathlength, starttime } = this.state;

  let url = `${DISTILL_URL}?from=`;
  url += `${encodeURIComponent(starttime)}&to=`;
  url += `${encodeURIComponent(endtime)}&size=250&target_in=`;
  url += `${encodeURIComponent(includedTargetQuery)}&`;
  url += `minpathlength=${encodeURIComponent(minpathlength)}&`;
  url += `maxpathlength=${encodeURIComponent(maxpathlength)}&`;
  url += 'event=';

  return axios.get(url)
    .then((response) => {
      console.log(url);
      console.log("RESPONSE DATA FROM DISTILL, should be upon load, in apps.js");
      console.log(response.data);

      let allTargets = getAllTargets(response.data.histogram);
      
      let excludedTargetQuery = defineExcludedTargets(allTargets);
      let includedTargetQuery = defineIncludedTargets(allTargets);

      this.props.app.results.counts = response.data.histogram;
      this.props.app.results.sankey = {
        nodes : response.data.nodes, 
        links : response.data.links,
      };
      this.props.app.results.allTargets = allTargets;

      this.updateResultParameters({ includedTargetQuery }, includedTargetQuery);
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  render() {
    const { name, results } = this.props.app;

    return(
      <div className='ui padded grid' id='results-content'>
        <div className='sixteen wide column ui large header center aligned'>
          Log Analysis
        </div>

        <div className='ui padded grid'>

          <div className='three wide column'>
            <div id='results-controls' className='ui vertical fluid accordion menu'>

              <div className='item'>
                <a id='counts' className='active main-controls title'>
                  <h2 className="ui dividing header">Control Panel</h2>
                  <br/>
                </a>
                <div className='active content'>

                  <div className='content'>
                    <div className='ui form'>

                      <h4 className="ui dividing header">Event Based Filter</h4>
                      <div className='grouped fields'>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value='' defaultChecked></input>
                            <label>All</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value='mouseover'></input>
                            <label>Mouseover</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checked checkbox'>
                            <input type='radio' name='metric' value='click'></input>
                            <label>Click</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value='blur'></input>
                            <label>Blur</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value='focus'></input>
                            <label>Focus</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value='scroll'></input>
                            <label>Scroll</label>
                          </div>
                        </div>
                      </div>


                      <h4 className="ui dividing header">Path Length Filter</h4>
                      <div className='grouped fields'>
                        <div className='two fields'>
                          <div className='ui field'>
                            <label>Min</label>
                            <input type="text" name="min-path-length" defaultValue={this.state.minpathlength} />
                          </div>
                          <div className='ui field'>
                            <label>Max</label>
                            <input type="text" name="max-path-length" defaultValue={this.state.maxpathlength} />
                          </div>
                        </div>
                      </div>


                      <h4 className="ui dividing header">Timeframe Filter</h4>
                      <div className='grouped fields'>
                        <div className='two fields'>
                          <div className='ui field' id="start-time-div" >
                            <label>Start logs from:</label>
                            <input type="text" name="start-time" defaultValue={this.state.starttime}></input>
                          </div>
                          <div className='ui field' id="end-time-div">
                            <label>End logs at:</label>
                            <input type="text" name="end-time" defaultValue={this.state.endtime}></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <br/>
            May take a several seconds for initial render...
            <br/>
            <br/>
            If screen stalls and is blank for more than several seconds at any time, toggle between the event based filters.
          </div>
          

          <div className='thirteen wide column'>
            <div className='ui basic row segment'>
              {(() => {
                switch (this.state.result) {
                  case 'graph':
                    return (
                      <div>
                        <GraphMetrics metric={this.state.metric} element='graph-metrics-viz' data={results.graph} />
                        {this.state.graphAb ?
                          <GraphMetrics
                            metric='betweenness_cent_dir_weighted'
                            element='graph-metrics-viz-b'
                            data={results.graph}
                          /> : null
                        }
                      </div>
                    );
                  case 'sankey':
                    return (
                      <div>
                        <SankeyPlot filters={this.state} data={results.sankey} element='sankey-plot-viz' metric={this.state.metric} />
                      </div>
                    );
                  case 'counts':
                  default: 
                    return (
                      <div>
                        <SankeyPlot filters={this.state} data={results.sankey} element='sankey-plot-viz' metric={this.state.metric} />
                        <Counts filters={this.state} data={results.counts} />
                      </div>
                    ); 
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }
};


function getAllTargets(histdata) {

    let everyTarget = [];

    histdata.forEach(function(d) {
      everyTarget.push(
        {"target" : d.target,
         "pathLength" : d.pathLength,
        });
    });


    return everyTarget;
};

function defineExcludedTargets(everyTarget) {
  let minLen = $('input[name=min-path-length]').val();
  let maxLen = $('input[name=max-path-length]').val();

  let newQuery = '';
  let count = 0;

  everyTarget.forEach(function(d) {
    if(d.pathLength <= minLen || d.pathLength >= maxLen) {
      let reformattedTarget = d.target.replace(/#/g, "%23");
      reformattedTarget = reformattedTarget.replace(/ /g, "%20");
      newQuery = newQuery+reformattedTarget+",";
      count = count+1;
    };
    

  });

  console.log("excluded targets: " + count);
  return newQuery;

};


function defineIncludedTargets(everyTarget) {
  let minLen = $('input[name=min-path-length]').val();
  let maxLen = $('input[name=max-path-length]').val();

  let newQuery = '';
  let count = 0;

  everyTarget.forEach(function(d) {
    if(d.pathLength >= minLen & d.pathLength <= maxLen) {
      let reformattedTarget = d.target.replace(/#/g, "%23");
      reformattedTarget = reformattedTarget.replace(/ /g, "%20");
      newQuery = newQuery+reformattedTarget+",";
      count = count+1;
    };
    

  });

  console.log("included targets: " + count);
  return newQuery;


};




AppResults.propTypes = {
  app : PropTypes.object,
};

export default AppResults;