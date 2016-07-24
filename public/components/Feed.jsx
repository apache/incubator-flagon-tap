import React, { Component, PropTypes } from 'react';

class Feed extends Component {
  render() {
    return(
      <div className='ui segment'>
        <div className='ui feed'>
          {this.props.feed.map((ev, index) => {
            return(
              <div key={index} className='event'>
                <div className='label'>
                  <i className='comment outline icon'></i>
                </div>
                <div className='content'>
                  <div className='summary'>
                    {ev}
                    <div className='date'>
                      {ev.date ? ev.date.toString() : 'Today'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Feed.propTypes = {
  feed : PropTypes.array,
};

export default Feed;
