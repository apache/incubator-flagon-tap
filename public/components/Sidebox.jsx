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
