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
import Iframe from 'react-iframe';
import axios from 'axios';

import Counts from './visualizations/Counts';
//import GraphMetrics from './visualizations/GraphMetrics';
import SankeyPlot from './visualizations/SankeyPlot';
//import sankeyhtml from './visualizations/sankeyhtml';

const DISTILL_URL = require('../../secrets/senssoftconfig').default.distill_url;

// import DISTILL_URL from './././secrets/secret.py';

class AppResults extends Component {
  constructor(props) {
    
    //let initialResults = 
    
    super(props);
    this.props.app.results.allTargets = this.getInitialAppResults().allTargets;//initialResults.allTargets;
    this.state = {
      result : 'counts',
      metric : '',
      minpathlength : 1,
      maxpathlength : 8,
      starttime : 'now-15m',
      endtime : 'now',
      //educationlevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      //gender : 0,
      ab : false,
      graphAb : false,
      includedTargetQuery : '',
      //allTargets : [],//[{"target": "document", "pathLength": 1}, {"target": "Window", "pathLength": 1}], 
    };


    // this.state = {
    //   allTargets : initialResults.allTargets,
    // }

    // this.props.app.results.counts = initialResults.counts;
    // this.props.app.results.sankey = initialResults.sankey;
    // this.props.app.results.allTargets = initialResults.allTargets;
    //this.props.app.results.allTargets = parseForAllTargets(response.data.histogram);

  }

  componentDidMount() {

    $('.ui.radio.checkbox').checkbox({
      onChange : () => {
        let metric = $('input[name=metric]:checked').val();
        this.setState({ metric : metric });
        console.log("metric updated");
      },
    });

    $('.ui.field').checkbox({
      onChange : () => {

        this.setState({ minpathlength : $('input[name=min-path-length]').val()});
        this.setState({ maxpathlength : $('input[name=max-path-length]').val()});
        this.setState({ starttime : $('input[name=start-time]').val()});
        this.setState({ endtime : $('input[name=end-time]').val()});

        console.log("text field updated");
      },
    });

    // $('.ui.education.checkbox').checkbox({
    //   onChange : () => {
    //     let educationlevels = [];
    //     $('input[name=education]:checked').each((i, el) => {
    //       educationlevels.push(+$(el).val());
    //     });
    //     this.setState({ educationlevels : educationlevels });
    //   },
    // });

  }

  render() {

    // console.log(DISTILL_URL);
    // console.log("hERERE");

    const { name, results } = this.props.app;
    let includedTargetQuery = defineIncludedTargets(this.props.app.results.allTargets);

    var url = DISTILL_URL+'?from='+this.state.starttime+'&to='+this.state.endtime+'&event='+this.state.metric+'&target_in='+includedTargetQuery;
    //var url = 'http://localhost:8090';       
    axios.get(url)
      .then( (response) => {
        //console.log("response", response);
        //var sankeyhtml = response.data;
        console.log(url);
        console.log("RESPONSE DATA FROM DISTILL");
        console.log(response.data);
        //console.log("Filters: " + this.state.metric);

        this.props.app.results.counts = response.data.histogram;
        this.props.app.results.sankey = {
            nodes : response.data.nodes, 
            links : response.data.links,
          };
      })
      .catch( (error) => {
        console.log(error);
      });




    return(

      <div className='ui padded grid' id='results-content'>
        <div className='sixteen wide column ui large header center aligned'>
          Log Analysis
          {//name
          }
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
                            <input type="text" name="min-path-length" defaultValue="2"></input>
                          </div>
                          <div className='ui field'>
                            <label>Max</label>
                            <input type="text" name="max-path-length" defaultValue="10"></input>
                          </div>
                        </div>
                      </div>


                      <h4 className="ui dividing header">Timeframe Filter</h4>
                      <div className='grouped fields'>
                        <div className='two fields'>
                          <div className='ui field' id="start-time-div" >
                            <label>Start logs from:</label>
                            <input type="text" name="start-time" defaultValue="now-15m"></input>
                          </div>
                          <div className='ui field' id="end-time-div">
                            <label>End logs at:</label>
                            <input type="text" name="end-time" defaultValue="now"></input>
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

getInitialAppResults() {

    var url = DISTILL_URL+'?from=now-50d&to=now&size=250';
    //var url = 'http://localhost:8090/sankey/userale-js?from=now-25d&to=now-20d&size=25;       
    axios.get(url)
      .then( (response) => {
        console.log(url);
        console.log("RESPONSE DATA FROM DISTILL, should be upon load, in apps.js");
        console.log(response.data);

        let counts = response.data.histogram;
        let sankey = {
            nodes : response.data.nodes, 
            links : response.data.links,
          };

        let allTargets = getAllTargets(response.data.histogram);
        
        let excludedTargetQuery = defineExcludedTargets(allTargets);
        let includedTargetQuery = defineIncludedTargets(allTargets);

        this.props.app.results.allTargets = allTargets;
        return { 
            counts: counts, 
            sankey: sankey, 
            allTargets: allTargets,
            includedTargetQuery: includedTargetQuery,
        };
      })
      .catch( (error) => {
        console.log(error);
      }); 

      return {counts: [], sankey: {}, allTargets: [], includedTargetQuery: ""};

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
