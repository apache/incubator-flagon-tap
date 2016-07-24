import React, { Component, PropTypes } from 'react';

class Settings extends Component {
  componentDidMount() {
    let $settingsControls = $('#settings-menu .item');
    $settingsControls.on('click', (e) => {
      $settingsControls.removeClass('active');
      $(e.target).addClass('active');
    });
  }

  render() {
    const { settings } = this.props;

    return (
      <div className='ui grid'>
        <div className='four wide column'>
          <div id='settings-menu' className='ui vertical fluid tabular menu'>
            <a className='item active'>
              Account
            </a>
            <a className='item'>
              Notifications
            </a>
            <a className='item'>
              Organizations
            </a>
          </div>
        </div>

        <div className='twelve wide stretched column'>
          <div className='ui segment'>
            <ul>
              {Object.keys(settings).map((setting, index) => {
                return (
                  <li key={index}>
                    {setting}, {settings[setting].toString()}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  settings : PropTypes.object,
};

export default Settings;
