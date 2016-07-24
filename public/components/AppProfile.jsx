import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Profile from './Profile';

class AppProfile extends Component {
  render () {
    const { id, name, users } = this.props;

    return (
      <div className='ui text container'>
        <div className='ui vertical basic page segment'>
          <div className='ui large header'>
            {name}
          </div>
          <Link to={`/app/${id}/settings`}>
            <div className='ui brown button'>
              Settings
            </div>
          </Link>
          <Link to={`/app/${id}/results`}>
            <div className='ui brown button'>
              Results
            </div>
          </Link>
        </div>

        <Profile feed={['a', 1, 'c']} firstSide={users} firstType={'user'} />
      </div>
    );
  }
}

AppProfile.propTypes = {
  id : PropTypes.number,
  name : PropTypes.string,
  users : PropTypes.array,
};

export default AppProfile;
