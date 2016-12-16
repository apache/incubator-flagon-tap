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

import * as d3 from 'd3';

const colors_old = ['#A7003C', '#00A76B', '#0090A7', '#003DA7', '#6B00A7'];
const colors_new = ['#d45d35', '#DBA915', '#BFD02C', '#38A6D8', '#852EB7'];

class VerticalBar extends Component {
  constructor(props) {
    super(props);

    this.d3element = 'vertical-bar';
  }

  componentDidMount() {
    this.margin = {
      top : 20,
      right : 20,
      bottom : 30,
      left : 40,
    };
    this.fullWidth = 600;
    this.fullHeight = 400;
    this.width = this.fullWidth - this.margin.left - this.margin.right;
    this.height = this.fullHeight - this.margin.top - this.margin.bottom;

    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1)
      .align(0.1);

    this.x1 = d3.scaleBand()
      .domain(['ot1', 'ot2']);

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    this.color = d3.scaleOrdinal()
      .range(colors_old);

    // this.color = d3.scaleOrdinal()
    //   .range([
    //     '#A7003C', // Red
    //     '#00A76B', // Green
    //     '#0090A7', // Teal
    //     '#003DA7', // Blue
    //     '#6B00A7'  // Purple
    //   ]);

    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);

    this.create();
  }

  shouldComponentUpdate() {
    setTimeout(this.update.bind(this), 0);
    return false;
  }

  render() {
    return(
      <div id={this.d3element}></div>
    );
  }

  create() {
    this.svg = d3.select(`#${this.d3element}`).append('svg')
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${this.height})`);

    this.svg.append('g')
      .attr('class', 'y axis');

    this.update();
  }

  update() {
    let data = this.props.data;
    let grouped = this.props.grouped;

    let t = d3.transition()
      .duration(500);

    this.x.domain(data.map((d) => d.id));
    this.x1.rangeRound([0, this.x.bandwidth()]);
    this.y.domain([0, d3.max(data, (d) => {
      return grouped ? Math.max(d.ot1, d.ot2) : (d.ot1 + d.ot2);
    })]);

    this.svg.select('.x.axis').call(this.xAxis);
    this.svg.select('.y.axis').call(this.yAxis);

    this.groups = this.svg.selectAll('.group')
      .data(data, (d) => d.id);

    this.groups.exit()
      .attr('class', 'exit')
      .transition(t)
      .style('fill-opacity', 0)
      .remove();

    this.groups = this.groups.enter()
      .append('g')
      .attr('class', 'group')
      .merge(this.groups);

    this.groups
      .transition(t)
      .attr('transform', (d) => `translate(${this.x(d.id)},0)`);

    this.bars = this.groups.selectAll('.bar')
      .data((d) => {
        if (grouped) {
          var ot1 = {
            id : d.id,
            selected : d.selected,
            count : d.ot1,
            type : 'ot1',
          };

          var ot2 = {
            id : d.id,
            selected : d.selected,
            count : d.ot2,
            type : 'ot2',
          };

          return [ot1, ot2];
        } else {
          d.count = d.ot1 + d.ot2;
          return [d];
        }
      });

    this.bars.exit()
      .attr('class', 'exit')
      .transition(t)
      .style('fill-opacity', 0)
      .remove();

    this.bars = this.bars.enter()
      .append('rect')
      .attr('height', 0)
      .attr('class', 'bar')
      .merge(this.bars);

    this.bars
      .on('click', (d) => {
        this.props.select(d.id);
      })
      .transition(t)
      .attr('x', (d) => grouped ? this.x1(d.type) : 0)
      .attr('width', (d) => grouped ? this.x1.bandwidth() : this.x.bandwidth())
      .attr('y', (d) => this.y(d.count))
      .attr('height', (d) => this.height - this.y(d.count))
      .style('fill', (d) => grouped ? this.color(d.type) : this.color(d.id))
      .style('stroke', (d) => d.selected ? '#283F4E' : '')
      .style('stroke-width', (d) => d.selected ? '3px' : '0px');


  }
}

// VerticalBar.propTypes = {
//   data : PropTypes.array,
//   selections : PropTypes.object,
// };

export default VerticalBar;
