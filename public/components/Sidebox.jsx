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
import { Link } from 'react-router';

class Sidebox extends Component {
  render() {
    return(
      <div className='ui segment'>
        <ul>
          {this.props.content.map((element) => {
            if (this.props.type !== 'user') {
              return(
                <Link key={element.id} to={`/${this.props.type}/${element.id}`}>
                  <li>
                    {element.id}, {element.name}
                  </li>
                </Link>
              );
            } else {
              return(
                <li key={element.id}>
                  {element.id}, {element.email}
                </li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}

Sidebox.propTypes = {
  content : PropTypes.array,
  type : PropTypes.string,
};

export default Sidebox;
