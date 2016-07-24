import React, { Component, PropTypes } from 'react';

import Settings from './Settings';

class AppSettings extends Component {
  render() {
    const { name, settings } = this.props;

    return(
      <div className='ui text container'>
        <div className='ui large header'>
          Settings for {name}
        </div>
        <Settings settings={settings} />
      </div>
    );
  }
}

AppSettings.propTypes = {
  name : PropTypes.string,
  settings : PropTypes.object,
};

export default AppSettings;
