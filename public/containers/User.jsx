import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class User extends Component {
  render() {
    const { children, email, settings, orgs, apps } = this.props;

    return (
      <div>
        {React.cloneElement(children, {
          email,
          settings,
          orgs,
          apps,
        })}
      </div>
    );
  }
}

User.propTypes = {
  email : PropTypes.string.isRequired,
  settings : PropTypes.object.isRequired,
  orgs : PropTypes.array,
  apps : PropTypes.array,
};

function mapStateToProps(state, ownProps) {
  return {
    email : state.user.email,
    settings : state.user.settings,
    orgs : state.user.orgs,
    apps : state.user.apps,
  };
}

export default connect(mapStateToProps)(User);
