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
//import {'d3-interpolate'} from 'd3';
//require('../../d3sankey.js').default;
//import sankey as sankeynow from '/d3-sankey.js';

const colors_old = ['#A7003C', '#00A76B', '#0090A7', '#003DA7', '#6B00A7'];
const colors_new = ['#d45d35', '#DBA915', '#BFD02C', '#38A6D8', '#852EB7'];

class SankeyPlot extends Component {
  constructor(props) {
    super(props);

    //this.d3element = props.element;
    this.d3element = 'sankey-plot';
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
    this.fullWidth = 800;
    this.fullHeight = 400;
    this.width = this.fullWidth - this.margin.left - this.margin.right;
    this.height = this.fullHeight - this.margin.top - this.margin.bottom;

    this.formatNumber = d3.format(',.0f');
    this.format = d => `${this.formatNumber(d)} TWh`;
    
    //this.mainRadius = 280;

    //this.update();

    this.color = d3.scaleOrdinal()
      .range(colors_old);

    this.svg = d3.select(`#${this.d3element}`).append('svg')
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)
      .append('g');
      //.attr('transform', `translate(${this.margin.left + this.width / 2},${this.margin.top + this.height / 2})`);

    this.sankey = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([this.width, this.height]);

    this.path = this.sankey.link();


    // this.tooltip = d3.select('body').append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0);

    this.update();
  }

  // D3 render
  update() {

    let data = this.props.data;//[this.props.metric];
    //if (data == null) {
    //let data = require('../../sankey_example.js').default;
    //};
    console.log("SANKEY PROPS DATA");
    console.log(this.props.data);
    // console.log("data in update = " + data);
    // console.log("nodes: "+ data[0].nodes.length);
    // console.log("links: "+ data[1].links.length);



    this.sankey
      .nodes(data.nodes)
      .links(data.links)
      .layout(32);

    d3.selectAll(".linkSankey").remove();
    d3.selectAll(".nodeSankey").remove();

    const link = this.svg.append('g').selectAll('.linkSankey')
      .data(data.links)
      .enter().append('path')
      .attr('class', 'linkSankey')
      .attr('d', this.path)
      .style('stroke-width', d => d.dy) //d => Math.max(50, d.dy))
      .style('fill', 'none')
      .style('stroke', "#000")
      .style('stroke-opacity', .2)
      .sort((a, b) => b.dy - a.dy);

    link.append('title')
      .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

    const node = this.svg.append('g').selectAll('.nodeSankey')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'nodeSankey')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .call(d3.drag()
        .subject(d => d)
        .on('start', function() {
          this.parentNode.appendChild(this);
        })
        //.on('drag', this.dragmove()));
        .on('drag', function(d) {
            // console.log("YAY DRAG");
            // console.log(d.x);
            // console.log(d.y);
            // console.log(d3.event.y);
            // d3.select(this).attr('transform', d => `translate(${d.x},50)`);//${d.y = Math.max(0, Math.min(this.fullHeight - d.dy, d3.event.y))})`);
            // this.sankey.relayout();
            // link.attr('d', this.path);
        }));

    // console.log("rect size");
    // console.log(d => d.dy);

    node.append('rect')
      .attr('height', d => d.dy)
      .attr('width', this.sankey.nodeWidth())
      .style('fill', d => d.color = this.color(d.name.replace(/ .*/, '')))
      .style('stroke', d => d3.rgb(d.color).darker(2))
      .append('title');
      //.text(d => `${d.name}`);

    // node.append('title')
    //   .text(d => `${d.name}`);// → ${d.target.name}\n${d.value}`);


    node.append('text')
      .attr('x', -6)
      .attr('y', d => d.dy / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .text(d => d.name[0,9])
      .filter(d => d.x < this.width / 2)
      .attr('x', 6 + this.sankey.nodeWidth())
      .attr('text-anchor', 'start');

  }
  
  dragmove(d) {
    console.log("DRAGGING HAPPENED");// - dragmove called unnecessarily - todo: fix");
    // d3.select(this).attr('transform', `translate(${d.x},${d.y = Math.max(0, Math.min(this.height - d.dy, d3.event.y))})`);
    // sankey.relayout();
    // link.attr('d', this.path);
  }

  hideTooltip() {
    console.log("HIDE TOOLTIP HAPPENED - todo: verify");
    this.tooltip.transition()
      .duration(350)
      .style('opacity', 0);
  }

  showTooltip(activity, x, y) {
    console.log("SHOW TOOLTIP HAPPENED - todo: verify");
    this.tooltip.transition()
      .duration(350)
      .style('opacity', 0.9);

    this.tooltip
      .style('left', (x + 6) + 'px')
      .style('top', (y - 28) + 'px')
      .html(`Action: ${activity.action}<br>Id: ${activity.elementId}<br>Group: ${activity.elementGroup}`);
  }



// d3-sankey layout taken from: <<>> and modified by Ryan
function sankey() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 20,
      size = [1, 1],
      align = 'left',
      nodes = [],
      links = [];
      

    sankey.nodeWidth = function(_) {
      if (!arguments.length) return nodeWidth;
      nodeWidth = +_;
      return sankey;
    };

    sankey.nodePadding = function(_) {
      if (!arguments.length) return nodePadding;
      nodePadding = +_;
      return sankey;
    };

    sankey.nodes = function(_) {
      if (!arguments.length) return nodes;
      nodes = _;
      return sankey;
    };

    sankey.links = function(_) {
      if (!arguments.length) return links;
      links = _;
      return sankey;
    };

    sankey.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return sankey;
    };

    sankey.layout = function(iterations) {
      computeNodeLinks();
      computeNodeValues();
      computeNodeBreadths();
      computeNodeDepths(iterations);
      computeLinkDepths();
      return sankey;
    };

    sankey.relayout = function() {
      computeLinkDepths();
      return sankey;
    };

    sankey.link = function() {
      var curvature = .5;

      function link(d) {
        var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
        return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
      }

      link.curvature = function(_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
      };

      return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
      nodes.forEach(function(node) {
        node.sourceLinks = [];
        node.targetLinks = [];
      });
      links.forEach(function(link) {
        var source = link.source,
          target = link.target;
        if (typeof source === "number") source = link.source = nodes[link.source];
        if (typeof target === "number") target = link.target = nodes[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function(node) {
        node.value = Math.max(
          d3.sum(node.sourceLinks, value),
          d3.sum(node.targetLinks, value)
        );
      });
    }
    sankey.nodeAlign = function(_) {
      return arguments.length ? (align = typeof _ === "function" ? _ : constant(_), sankey) : align;
    };
    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
      var remainingNodes = nodes,
        nextNodes,
        x = 0;

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function(node) {
          node.x = x;
          node.dx = nodeWidth;
          node.sourceLinks.forEach(function(link) {
            if (nextNodes.indexOf(link.target) < 0) {
              nextNodes.push(link.target);
            }
          });
        });
        remainingNodes = nextNodes;
        ++x;
      }

      // if (reverse) {
      //   // Flip nodes horizontally
      //   nodes.forEach(function(node) {
      //     node.x *= -1;
      //     node.x += x - 1;
      //   });
      // }
  
      if (align === 'center') {
        moveSourcesRight();
      }
      if (align === 'justify') {
        moveSinksRight(x);
      }
  
      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }
  
    function moveSourcesRight() {
      nodes.slice()
        // Pack nodes from right to left
        .sort(function(a, b) { return b.x - a.x; })
        .forEach(function(node) {
          if (!node.targetLinks.length) {
            node.x = d3Array.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
          }
        });
    }
  
    function moveSinksRight(x) {
      nodes.forEach(function(node) {
        if (!node.sourceLinks.length) {
          node.x = x - 1;
        }
      });
    }

    function moveSourcesRight() {
      nodes.forEach(function(node) {
        if (!node.targetLinks.length) {
          node.x = d3.min(node.sourceLinks, function(d) {
            return d.target.x;
          }) - 1;
        }
      });
    }

    function moveSinksRight(x) {
      nodes.forEach(function(node) {
        if (!node.sourceLinks.length) {
          node.x = x - 1;
        }
      });
    }

    function scaleNodeBreadths(kx) {
      nodes.forEach(function(node) {
        node.x *= kx;
      });
    }

    function computeNodeDepths(iterations) {
      var nodesByBreadth = d3.nest()
        .key(function(d) {
          return d.x;
        })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) {
          return d.values;
        });

      //
      initializeNodeDepth();
      resolveCollisions();
      for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= .99);
        resolveCollisions();
        relaxLeftToRight(alpha);
        resolveCollisions();
      }

      function initializeNodeDepth() {
        var ky = d3.min(nodesByBreadth, function(nodes) {
          return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
        });

        nodesByBreadth.forEach(function(nodes) {
          nodes.forEach(function(node, i) {
            node.y = i;
            node.dy = node.value * ky;
          });
        });

        links.forEach(function(link) {
          link.dy = link.value * ky;
        });
      }

      function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function(nodes, breadth) {
          nodes.forEach(function(node) {
            if (node.targetLinks.length) {
              var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedSource(link) {
          return center(link.source) * link.value;
        }
      }

      function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function(nodes) {
          nodes.forEach(function(node) {
            if (node.sourceLinks.length) {
              var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedTarget(link) {
          return center(link.target) * link.value;
        }
      }

      function resolveCollisions() {
        nodesByBreadth.forEach(function(nodes) {
          var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

          // Push any overlapping nodes down.
          nodes.sort(ascendingDepth);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = y0 - node.y;
            if (dy > 0) node.y += dy;
            y0 = node.y + node.dy + nodePadding;
          }

          // If the bottommost node goes outside the bounds, push it back up.
          dy = y0 - nodePadding - size[1];
          if (dy > 0) {
            y0 = node.y -= dy;

            // Push any overlapping nodes back up.
            for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              dy = node.y + node.dy + nodePadding - y0;
              if (dy > 0) node.y -= dy;
              y0 = node.y;
            }
          }
        });
      }

      function ascendingDepth(a, b) {
        return a.y - b.y;
      }
    }

    function computeLinkDepths() {
      nodes.forEach(function(node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
      });
      nodes.forEach(function(node) {
        var sy = 0,
          ty = 0;
        node.sourceLinks.forEach(function(link) {
          link.sy = sy;
          sy += link.dy;
        });
        node.targetLinks.forEach(function(link) {
          link.ty = ty;
          ty += link.dy;
        });
      });

      function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
      }

      function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
      }
    }

    function center(node) {
      return node.y + node.dy / 2;
    }

    function value(link) {
      return link.value;
    }

    sankey.align = function(_) {
      if (!arguments.length) return align;
      align = _.toLowerCase();
      return sankey;
    };

    return sankey;
  }



SankeyPlot.propTypes = {
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


export default SankeyPlot;
