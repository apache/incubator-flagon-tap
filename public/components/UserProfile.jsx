import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Profile from './Profile';

class UserProfile extends Component {
  render () {
    const { email, orgs, apps } = this.props;

    return (
      <div className='ui text container'>
        <div className='ui vertical basic page segment'>
          <div className='ui large header'>
            {`${email}'s Profile`}
          </div>
        </div>

        <Profile feed={['a', 1, 'c']} firstSide={orgs} firstType={'org'} secondSide={apps} secondType={'app'} />
      </div>
    );
  }
}

UserProfile.propTypes = {
  email : PropTypes.string,
  orgs : PropTypes.array,
  apps : PropTypes.array,
};

export default UserProfile;
