import React, { Component, PropTypes } from 'react';

import Counts from './visualizations/Counts';
import GraphMetrics from './visualizations/GraphMetrics';

class AppResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result : 'counts',
      metric : 'out_degree',
      ethnicities : [1, 2, 3, 4, 5, 6, 7],
      gender : 0,
      ab : false,
    };
  }

  componentDidMount() {
    $('#ethnicity-accordion').accordion({
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

    $('.ui.ethnicity.checkbox').checkbox({
      onChange : () => {
        let ethnicities = [];
        $('input[name=ethnicity]:checked').each((i, el) => {
          ethnicities.push(+$(el).val());
        });
        this.setState({ ethnicities : ethnicities });
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
                      <div id='ethnicity-accordion' className='accordion'>
                        <div className='title'>
                          <i className='dropdown icon'></i>
                          Ethnicity
                        </div>
                        <div className='content'>

                          <div className='ui form'>
                            <div className='grouped fields'>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='1' defaultChecked></input>
                                  <label>Asian</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='2' defaultChecked></input>
                                  <label>Pacific Islander</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='3' defaultChecked></input>
                                  <label>African American/Of African Descent</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='4' defaultChecked></input>
                                  <label>White/Caucasian</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='5' defaultChecked></input>
                                  <label>Native American</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='6' defaultChecked></input>
                                  <label>Indian</label>
                                </div>
                              </div>
                              <div className='field'>
                                <div className='ui ethnicity checkbox'>
                                  <input type='checkbox' name='ethnicity' value='7' defaultChecked></input>
                                  <label>Decline to State</label>
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
                    return <GraphMetrics metric={this.state.metric} element={'graph-metrics-viz'} data={this.props.results.graph} />;
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
