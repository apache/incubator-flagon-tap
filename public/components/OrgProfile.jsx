import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Profile from './Profile';

class OrgProfile extends Component {
  render() {
    const { id, name, description, apps, users } = this.props;

    return(
      <div className='ui text container'>
        <div className='ui vertical basic page segment'>
          <div className='ui large header'>
            {name}
          </div>
          <Link to={`/org/${id}/settings`}>
            <div className='ui brown button'>
              Settings
            </div>
          </Link>
        </div>

        <Profile feed={['a', 1, 'c']} firstSide={apps} firstType={'app'} secondSide={users} secondType={'user'} />
      </div>
    );
  }
}

OrgProfile.propTypes = {
  id : PropTypes.number,
  name : PropTypes.string,
  description : PropTypes.string,
  apps : PropTypes.array,
  users : PropTypes.array,
};

export default OrgProfile;
