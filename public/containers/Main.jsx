import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logIn, logOut } from '../actions';

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin () {
    this.props.logIn();
  }

  handleLogout () {
    this.props.logOut();
  }

  render () {
    const { children, isLoggedIn, username } = this.props;
    return (
      <div id='main-container'>
        <div className='site-header'>
          <div className='ui brown inverted padded top fixed borderless menu'>
            <div className='ui container'>

              <Link to='/'>
                <h3 className='ui inverted header item'>Tap</h3>
              </Link>

              <div className='right menu'>
                {
                // <div className='item' onClick={isLoggedIn ? this.handleLogout : this.handleLogin }>
                //   {isLoggedIn ? 'Log Out' : 'Log In'}
                // </div>
                }
                <div className='item'>
                  <Link to='/user'>
                    Profile
                  </Link>
                </div>
                <div className='item'>
                  <Link to='/user/settings'>
                    Settings
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div id='page-wrapper'>
          {children}
        </div>

        <div className='site-footer'>
          <div className='ui container'>
            <div className='ui footer page brown inverted segment'>
              <div className='ui center aligned container'>
                <div className='footer-text'>Copyright Tap 2016</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  children : PropTypes.node,
  isLoggedIn : PropTypes.bool.isRequired,
  username : PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  return {
    isLoggedIn : state.auth.isLoggedIn,
    email : state.auth.isLoggedIn ? state.user.email : null,
  };
}

export default connect(mapStateToProps, {
  logIn,
  logOut,
})(Main);
