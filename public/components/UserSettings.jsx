import React, { Component, PropTypes } from 'react';

import Settings from './Settings';

class UserSettings extends Component {
  render () {
    const { email, settings } = this.props;

    return (
      <div className='ui text container'>
        <div className='ui large header'>
          Settings for {email}
        </div>
        <Settings settings={settings} />
      </div>
    );
  }
}

UserSettings.propTypes = {
  email : PropTypes.string,
  settings : PropTypes.object,
};

export default UserSettings;
