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

class GraphMetrics extends Component {
  constructor(props) {
    super(props);
    this.d3element = props.element;
  }

  componentDidMount() {
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

  // D3 initialization (scales, axes, etc.)
  create() {
    this.margin = {
      top : 20,
      right : 20,
      bottom : 20,
      left : 20,
    };
    this.fullWidth = 600;
    this.fullHeight = 400;
    this.width = this.fullWidth - this.margin.left - this.margin.right;
    this.height = this.fullHeight - this.margin.top - this.margin.bottom;
    this.mainRadius = 280;

    // this.color = d3.scaleOrdinal()
    //   .range([
    //     '#A7003C', // Red
    //     '#00A76B', // Green
    //     '#0090A7', // Teal
    //     '#003DA7', // Blue
    //     '#6B00A7'  // Purple
    //   ]);

    this.color = d3.scaleOrdinal()
      .range(colors_old);

    this.arc = d3.arc()
      // .padAngle(0.002)
      .innerRadius(this.mainRadius - 50)
      .outerRadius(this.mainRadius);

    this.ribbon = d3.ribbon();

    this.graphFlow = graphFlow()
      .radius(this.mainRadius - 50)
      .innerRadius(this.mainRadius - 150);

    this.svg = d3.select(`#${this.d3element}`).append('svg')
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)
      .append('g')
      .attr('transform', `translate(${this.margin.left + this.width / 2},${this.margin.top + this.height / 2})`);

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.update();
  }

  // D3 render
  update() {
    let data = this.props.data[this.props.metric];
    let layout = this.graphFlow(data);

    let t = d3.transition()
      .duration(500);

    this.arcs = this.svg.selectAll('.arc')
      .data(layout.inArcs.concat(layout.outArcs), (d) => d.type + d.index);

    this.arcs.exit()
      .attr('class', 'exit')
      .transition(t)
      .style('fill-opacity', 0)
      .remove();

    this.arcs = this.arcs.enter()
      .append('path')
      .attr('class', 'arc')
      .merge(this.arcs);

    this.arcs
      .on('mouseover', (d) => {
        this.highlight(d, 'arc');
        this.showTooltip(data.in[d.index], d3.event.pageX, d3.event.pageY);
      })
      .on('mouseout', (d) => {
        this.restore();
        this.hideTooltip();
      })
      .transition(t)
      // TODO : add arc tweens
      .attr('d', this.arc)
      .style('fill', (d) => this.color(data.in[d.index].elementGroup));

    this.chords = this.svg.selectAll('.chord')
      .data(layout.inChords.concat(layout.outChords), (d) => d.index + d.type + d.subindex);

    this.chords.exit()
      .attr('class', 'exit')
      .transition(t)
      .style('fill-opacity', 0)
      .remove();

    this.chords = this.chords.enter()
      .append('path')
      .attr('class', 'chord')
      .style('fill', '#B0B9BE')
      .merge(this.chords);

    this.chords
      .transition(t)
      .attr('d', this.ribbon)
      .style('fill-opacity', 0.5);

    this.circles = this.svg.selectAll('.node')
      .data($.map(layout.blt, (val, key) => val), (d) => d.index);

    this.circles.exit()
      .attr('class', 'exit')
      .transition(t)
      .attr('r', 0)
      .remove();

    this.circles = this.circles.enter()
      .append('circle')
      .attr('class', 'node')
      .merge(this.circles);

    this.circles
      .on('mouseover', (d) => {
        this.highlight(d, 'circle');
        this.showTooltip(data.in[d.index], d3.event.pageX, d3.event.pageY);
      })
      .on('mouseout', (d) => {
        this.restore();
        this.hideTooltip();
      })
      .transition(t)
      .attr('r', (d) => d.r)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .style('fill', (d) => this.color(data.in[d.index].elementGroup))
      .style('fill-opacity', 0.75);

  }

  hideTooltip() {
    this.tooltip.transition()
      .duration(350)
      .style('opacity', 0);
  }

  showTooltip(activity, x, y) {
    this.tooltip.transition()
      .duration(350)
      .style('opacity', 0.9);

    this.tooltip
      .style('left', (x + 6) + 'px')
      .style('top', (y - 28) + 'px')
      .html(`Action: ${activity.action}<br>Id: ${activity.elementId}<br>Group: ${activity.elementGroup}`);
  }

  highlight(d, type) {
    var indices = [];

    if (type === 'arc') {
      this.chords.style('fill-opacity', (c) => {
        if (c.index !== d.index || c.type !== d.type) {
          return 0.1;
        } else {
          indices.push(c.subindex);
          return 0.5;
        }
      });

      this.circles.style('fill-opacity', (c) => indices.includes(c.index) ? 0.75 : 0.1);
      this.arcs.style('fill-opacity', (c) => c === d ? 1 : 0.25);
    } else if (type === 'circle') {
      this.chords.style('fill-opacity', (c) => {
        if (c.subindex !== d.index) {
          return 0.1;
        } else {
          indices.push(c.index);
          return 0.5;
        }
      });

      this.circles.style('fill-opacity', (c) => c === d ? 0.75 : 0.25);
      this.arcs.style('fill-opacity', (c) => indices.includes(c.index) ? 1 : 0.1);
    }
  }

  restore() {
    this.chords.style('fill-opacity', 0.5);
    this.circles.style('fill-opacity', 0.75);
    this.arcs.style('fill-opacity', 1);
  }
}


// Custom layout function for graph viz
// Converts input data into return arrays of component svg elements
function graphFlow() {
  const tau = Math.PI * 2;

  var padAngle = 0;
  var spaceAngle = tau / 4;
  var radius = 0;
  var innerRadius = 0;

  function layout(data) {
    var result = {};

    result.in = arrayToObj(data.in);
    result.out = arrayToObj(data.out);
    result.blt = arrayToObj(circleLayout(data.blt, innerRadius));

    var arcAngle = (tau - (spaceAngle * 2)) / 2;
    var inStart = (tau + spaceAngle) / 2;
    var outStart = spaceAngle / 2;

    var inSide = sideLayout(data.inMatrix, result.blt, inStart, arcAngle, padAngle, radius, 'in');
    var outSide = sideLayout(data.outMatrix, result.blt, outStart, arcAngle, padAngle, radius, 'out');

    result.inArcs = inSide[0];
    result.inChords = inSide[1];
    result.outArcs = outSide[0];
    result.outChords = outSide[1];

    return result;
  }

  layout.padAngle = (value) => {
    return value ? (padAngle = value, layout) : padAngle;
  };

  layout.spaceAngle = (value) => {
    return value ? (spaceAngle = value, layout) : spaceAngle;
  };

  layout.radius = (value) => {
    return value ? (radius = value, layout) : radius;
  };

  layout.innerRadius = (value) => {
    return value ? (innerRadius = value, layout) : innerRadius;
  };

  return layout;
}

function sideLayout(matrix, circles, startAngle, angle, padAngle, radius, type) {
  var n = matrix.length;
  var m = matrix[0].length;
  var groupSums = [];
  var total = 0;
  var arcs = new Array(n);
  var chordTemp = new Array(n * m);
  var chords = [];
  var k;
  var dx;
  var x;
  var x0;
  var i;
  var j;

  matrix.forEach((group) => {
    groupSums.push(group.reduce( (prev, curr) => prev + curr ));
  });

  total = groupSums.reduce( (prev, curr) => prev + curr );

  k = Math.max(0, angle - padAngle * n) / total;
  dx = k ? padAngle : angle / n;

  x = startAngle;
  i = -1;

  while(++i < n) {
    x0 = x;
    j = -1;

    while(++j < n) {
      var v = matrix[i][j];
      var a0 = x;
      var a1 = x += v * k;

      chordTemp[j + (n * i)] = {
        index : i,
        subindex : j,
        startAngle : a0,
        endAngle : a1,
        value : v,
      };
    }

    arcs[i] = {
      index : i,
      type : type,
      startAngle : x0,
      endAngle : x,
      value : groupSums[i],
    };

    x += dx;
  }

  chordTemp.forEach((chord) => {
    if (chord.value > 0) {
      let circle = circles[chord.subindex];

      chords.push({
        index : chord.index,
        subindex : chord.subindex,
        type : type,
        source : {
          startAngle : chord.startAngle,
          endAngle : chord.endAngle,
          radius : radius,
        },
        target : {
          startAngle : circle.theta - 0.001,
          endAngle : circle.theta + 0.001,
          radius : circle.radius,
        },
      });
    }
  });

  return [arcs, chords];

}

function circleLayout(circles, innerRadius) {
  circles.forEach((d) => {
    d.r = d.value;
  });

  d3.packSiblings(circles);
  var enclose = d3.packEnclose(circles);
  var k = innerRadius / enclose.r;

  circles.forEach((d) => {
    d.r = d.r * k;
    d.x = d.x * k;
    d.y = d.y * k;

    let rSq = Math.pow(d.x, 2) + Math.pow(d.y, 2);
    d.radius = Math.sqrt(rSq);
    d.theta = Math.atan2(d.y, d.x) + (Math.PI / 2);
  });

  return circles;
}

function arrayToObj(a) {
  var o = {};

  a.forEach((d) => {
    o[d.index] = d;
  });

  return o;
}

GraphMetrics.propTypes = {
  element : PropTypes.string.isRequired,
  data : PropTypes.object,
  metric : PropTypes.string.isRequired,
  // data : PropTypes.shape({
  //   inMatrix : PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  //   outMatrix : PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  //   in : PropTypes.arrayOf(PropTypes.shape({
  //     index : PropTypes.number,
  //     name : PropTypes.string,
  //   })),
  //   out : PropTypes.arrayOf(PropTypes.shape({
  //     index : PropTypes.number,
  //     name : PropTypes.string,
  //   })),
  //   between : PropTypes.arrayOf(PropTypes.shape({
  //     index : PropTypes.number,
  //     name : PropTypes.string,
  //     value : PropTypes.number,
  //   })),
  // }).isRequired,
};


export default GraphMetrics;
