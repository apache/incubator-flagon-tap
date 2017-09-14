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
import GraphMetrics from './visualizations/GraphMetrics';
import SankeyPlot from './visualizations/SankeyPlot';
//import sankeyhtml from './visualizations/sankeyhtml';

class AppResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result : 'counts',
      metric : 'click',
      //educationlevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      //gender : 0,
      ab : false,
      graphAb : false,
    };
  }

  componentDidMount() {
    // $('#education-accordion').accordion({
    //   collapsible : true,
    // });
    $('#results-controls').accordion({
      collapsible : false,
    });

    $('.main-controls.title').on('click', (e) => {
      let result = e.currentTarget.id;
      if (result !== this.state.result) {
        this.setState({ result : result });
      }
    });

    $('.ui.radio.checkbox').checkbox({
      onChange : () => {
        let metric = $('input[name=metric]:checked').val();
        this.setState({ metric : metric });
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

    // $('#gender-select').dropdown({
    //   onChange : (val) => {
    //     this.setState({ gender : val });
    //   },
    // });

    // $('#ab-toggle').checkbox({
    //   onChange : () => {
    //     this.setState({ ab : $('input[name=a-b]').is(':checked') });
    //   },
    // });

    $('#graph-ab-toggle').checkbox({
      onChange: () => {
        this.setState({ graphAb: $('input[name=graph-a-b]').is(':checked') });
      },
    });
  }

  render() {
    //console.log("is an app defined here?");
    //console.log(this.props.app);

    const { name, results } = this.props.app;
    console.log("RESULTS:");
    console.log(name);
    console.log(results);


    //get graph data from distill
    //var url = 'http://distill:8090/sankey/userale?from=now-15m&to=now&size=20'; //snarl-distill calls
    var url = 'http://vlsmsbx.draper.com:8090/sankey/userale-js?from=now-25d&to=now-10d&size=10&event='+this.state.metric;//mouseover,click'
    //var url = 'http://localhost:8090';       
    axios.get(url)
      .then( (response) => {
        //console.log("response", response);
        //var sankeyhtml = response.data;
        console.log(url);
        console.log("RESPONSE DATA FROM DISTILL");
        console.log(response.data);
        console.log("Filters:" + this.state.metric);
        this.props.app.results.counts = response.data.histogram;
        this.props.app.results.sankey = {
            nodes : response.data.nodes, 
            links : response.data.links,
          };
        // this.setState({
        //   fetchUser: response.data
        // });
        //console.log("fetchUser", this.state.fetchUser);
      })
      .catch( (error) => {
        console.log(error);
      }); 
    //var sankeyhtml = "";

    // var url = 'http://distill:8090/sankey/userale?from=now-15m&to=now&size=20';
    // var url = 'http://localhost:8090';
    // console.log('clicked');
    // $.get( url, function(data) {
    //      //As soon as the browser finished downloading, this function is called.
    //      console.log('url was: ' + url);
    //      console.log('data: ' + data);
    //      //$('#demo').html();
    //      });




    return(

      <div className='ui padded grid'>
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
                  <i className='dropdown icon'></i>
                  Control Panel
                </a>
                <div className='active content'>

                  <div className='content'>
                    <div className='ui form'>

                      <h4 className="ui dividing header">Path Length Filter</h4>
                      <div className='grouped fields'>
                        <div className='two fields'>
                          <div className='ui field'>
                            <label>Min</label>
                            <input type="text" name="min-path-length" placeholder="1"></input>
                          </div>
                          <div className='ui field'>
                            <label>Max</label>
                            <input type="text" name="max-path-length" placeholder="10"></input>
                          </div>
                        </div>
                      </div>

                      <h4 className="ui dividing header">Event Based Filter</h4>
                      <div className='grouped fields'>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value=''></input>
                            <label>All</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checkbox'>
                            <input type='radio' name='metric' value='mouseover' defaultChecked></input>
                            <label>Mouseover</label>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='ui radio checkbox'>
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
                      </div>

                    </div>
                  </div>
                </div>
              </div>



              <div className='item'>
                <a id='graph' className='main-controls title'>
                  <i className='dropdown icon'></i>
                  Graph Metrics Example
                </a>
                <div className='content'>
                  <div className='ui form'>
                    <div className='grouped fields'>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='out_degree' defaultChecked></input>
                          <label>Out Degree</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='in_degree'></input>
                          <label>In Degree</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='betweenness_cent_dir_weighted'></input>
                          <label>Weighted Betweenness</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='closeness_cent_dir_weighted'></input>
                          <label>Weighted Closeness</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='closeness_cent_dir_unweighted'></input>
                          <label>Unweighted Closeness</label>
                        </div>
                      </div>
                    </div>

                    <div className='field'>
                      <div id='graph-ab-toggle' className='ui toggle checkbox'>
                        <input type='checkbox' name='graph-a-b'></input>
                        <label>A/B</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='item'>
                <a id='sankey' className='main-controls title'>
                  <i className='dropdown icon'></i>
                  SankeyPlot
                </a>
                <div className='content'>
                  <div className='ui form'>
                    <div className='grouped fields'>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='sankey1' defaultChecked></input>
                          <label>Filter 1</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='sankey2'></input>
                          <label>Filter 2</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='sankey3'></input>
                          <label>Filter 3</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='sankey4'></input>
                          <label>Filter 4</label>
                        </div>
                      </div>
                      <div className='field'>
                        <div className='ui radio checkbox'>
                          <input type='radio' name='metric' value='sankey5'></input>
                          <label>Filter 5</label>
                        </div>
                      </div>
                    </div>

                    <div className='field'>
                      <div id='sankey-ab-toggle' className='ui toggle checkbox'>
                        <input type='checkbox' name='sankey-a-b'></input>
                        <label>A/B</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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




AppResults.propTypes = {
  app : PropTypes.object,
};

export default AppResults;
