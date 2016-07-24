import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    const { children, id, name, settings, results, users } = this.props;

    return(
      <div>
        {React.cloneElement(children, {
          id,
          name,
          settings,
          results,
          users,
        })}
      </div>
    );
  }
}

App.propTypes = {
  id : PropTypes.number,
  name : PropTypes.string,
  settings : PropTypes.object,
  results : PropTypes.object,
  users : PropTypes.array,
};

function mapStateToProps(state, ownProps) {
  return {
    id : state.app.id,
    name : state.app.name,
    settings : state.app.settings,
    results : state.app.results,
    users : state.app.users,
  };
}

export default connect(mapStateToProps)(App);
