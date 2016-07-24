import React, { Component, PropTypes } from 'react';

import Settings from './Settings';

class OrgSettings extends Component {
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

OrgSettings.propTypes = {
  name : PropTypes.string,
  settings : PropTypes.object,
};

export default OrgSettings;
