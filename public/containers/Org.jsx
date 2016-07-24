import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Org extends Component {
  render() {
    const { children, id, name, description, users, apps, settings } = this.props;

    return (
      <div>
        {React.cloneElement(children, {
          id,
          name,
          description,
          users,
          apps,
          settings,
        })}
      </div>
    );
  }
}

Org.propTypes = {
  id : PropTypes.number,
  name : PropTypes.string,
  description : PropTypes.string,
  users : PropTypes.array,
  apps : PropTypes.array,
  settings : PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  return {
    id : state.org.id,
    name : state.org.name,
    description : state.org.description,
    users : state.org.users,
    apps : state.org.apps,
    settings : state.org.settings,
  };
}

export default connect(mapStateToProps)(Org);
