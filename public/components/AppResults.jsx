import React, { Component, PropTypes } from 'react';

import Counts from './visualizations/Counts';
import GraphMetrics from './visualizations/GraphMetrics';

class AppResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result : 'counts',
      metric : 'out_degree',
      educationlevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      gender : 0,
      ab : false,
      graphAb : false,
    };
  }

  componentDidMount() {
    $('#education-accordion').accordion({
      collapsible : true,
    });
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

    $('.ui.education.checkbox').checkbox({
      onChange : () => {
        let educationlevels = [];
        $('input[name=education]:checked').each((i, el) => {
          educationlevels.push(+$(el).val());
        });
        this.setState({ educationlevels : educationlevels });
      },
    });

    $('#gender-select').dropdown({
      onChange : (val) => {
        this.setState({ gender : val });
      },
    });

    $('#ab-toggle').checkbox({
      onChange : () => {
        this.setState({ ab : $('input[name=a-b]').is(':checked') });
      },
    });

    $('#graph-ab-toggle').checkbox({
      onChange: () => {
        this.setState({ graphAb: $('input[name=graph-a-b]').is(':checked') });
      },
    });
  }

  render() {
    return(
      <div className='ui container'>
        <div className='ui large header'>
          Log Analysis for {this.props.name}
        </div>

        <div className='ui padded grid'>

          <div className='four wide column'>
            <div id='results-controls' className='ui vertical fluid accordion menu'>
              <div className='item'>
                <a id='counts' className='active main-controls title'>
                  <i className='dropdown icon'></i>
                  Activity Counts
                </a>
                <div className='active content'>
                  <div className='ui form'>

                    <div className='field'>
                      <div id='gender-select' className='ui fluid selection dropdown'>
                        <input type='hidden' name='gender'></input>
                        <i className='dropdown icon'></i>
                        <div className='default text'>Gender</div>
                        <div className='menu'>
                          <div className='item' data-value='0'>Both</div>
                          <div className='item' data-value='2'>Male</div>
                          <div className='item' data-value='1'>Female</div>
                        </div>
                      </div>
                    </div>

                    <div className='field'>
                      <div id='education-accordion' className='accordion'>
                        <div className='title'>
                          <i className='dropdown icon'></i>
                          Highest Education Level
                        </div>
                        <div className='content'>

                          <div className='ui form'>
                            <div className='grouped fields'>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='1' defaultChecked></input>
                                  <label>No schooling completed</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='2' defaultChecked></input>
                                  <label>Nursery school to 8th grade</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='3' defaultChecked></input>
                                  <label>9th, 10th, or 11th grade</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='4' defaultChecked></input>
                                  <label>12th grade, or no diploma</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='5' defaultChecked></input>
                                  <label>High school graduate</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='6' defaultChecked></input>
                                  <label>Some college credit</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='7' defaultChecked></input>
                                  <label>1 or more years of college</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='8' defaultChecked></input>
                                  <label>Associate degree</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='9' defaultChecked></input>
                                  <label>Bachelors degree</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='10' defaultChecked></input>
                                  <label>Masters degree</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='11' defaultChecked></input>
                                  <label>Professional degree</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui education checkbox'>
                                  <input type='checkbox' name='education' value='12' defaultChecked></input>
                                  <label>Doctorate degree</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='field'>
                      <div id='ab-toggle' className='ui toggle checkbox'>
                        <input type='checkbox' name='a-b'></input>
                        <label>A/B</label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className='item'>
                <a id='graph' className='main-controls title'>
                  <i className='dropdown icon'></i>
                  Graph Metrics
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
            </div>
          </div>

          <div className='twelve wide column'>
            <div className='ui basic row segment'>
              {(() => {
                switch (this.state.result) {
                  case 'graph':
                    return (
                      <div>
                        <GraphMetrics metric={this.state.metric} element='graph-metrics-viz' data={this.props.results.graph} />
                        {this.state.graphAb ?
                          <GraphMetrics
                            metric='betweenness_cent_dir_weighted'
                            element='graph-metrics-viz-b'
                            data={this.props.results.graph}
                          /> : null
                        }
                      </div>
                    );
                  case 'counts':
                  default:
                    return <Counts filters={this.state} data={this.props.results.counts} />;
                }
              })()}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

AppResults.propTypes = {
  name : PropTypes.string,
  results : PropTypes.object,
};

export default AppResults;
