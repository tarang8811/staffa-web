import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import Jobs from "../jobs/Jobs";

class JobBoard extends Component {
  state = {
    selectedTable: "Vacant"
  };

  handleClick = e => {
    this.setState({
      selectedTable: e
    });
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs } = this.props;
    let vacantSize = 0;
    let filledSize = 0;
    let unfilledSize = 0;
    if (jobs) {
      jobs = jobs.map(j => j.d)
      let vacant = jobs.filter(job => job.type === "Vacant");
      let filled = jobs.filter(job => job.type === "Filled");
      let unfilled = jobs.filter(job => job.type === "Unfilled");
      vacantSize = vacant.length;
      filledSize = filled.length;
      unfilledSize = unfilled.length;
    }
    return (
      <div className="dashboard container">
        <div className="center">
          <table className="centered">
            <thead>
              <tr>
                <th>
                  <button
                    onClick={() => this.handleClick("Vacant")}
                    className="btn btn-floating blue lighten-1 buttonC hoverable waves-effect waves-light"
                  >
                    {vacantSize}
                  </button>
                  <h5 className="white">Vacant Shifts</h5>
                </th>
                <th>
                  <button
                    onClick={() => this.handleClick("Filled")}
                    className="btn btn-floating green lighten-1 buttonC hoverable waves-effect waves-light"
                  >
                    {filledSize}
                  </button>
                  <h5 className="white">Filled Shifts</h5>
                </th>
                <th>
                  <button
                    onClick={() => this.handleClick("Unfilled")}
                    className="btn btn-floating orange lighten-1 buttonC hoverable waves-effect waves-light"
                  >
                    {unfilledSize}
                  </button>
                  <h5 className="white">Unfilled Shifts</h5>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <Jobs selectedTable={this.state.selectedTable} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: state.firestore.ordered.jobs,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "jobs"
    }
  ])
)(JobBoard);
