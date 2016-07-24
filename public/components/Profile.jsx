import React, { Component, PropTypes } from 'react';

import Feed from './Feed';
import Sidebox from './Sidebox';

class Profile extends Component {
  render() {
    const { feed, firstSide, secondSide, firstType, secondType } = this.props;

    return(
      <div className='ui padded grid'>
        <div className='ten wide column'>
          <Feed feed={feed} />
        </div>

        <div className='six wide column'>
          <Sidebox type={firstType} content={firstSide} />
          {(() => {
            if (secondSide) {
              return(
                <Sidebox type={secondType} content={secondSide} />
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  feed : PropTypes.array,
  firstSide : PropTypes.array,
  firstType : PropTypes.string,
  secondSide : PropTypes.array,
  secondType : PropTypes.string,
};

export default Profile;
