import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";

export class Jobs extends Component {
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs, selectedTable } = this.props;
    if(jobs){
      jobs = jobs.map(j => j.d)
    }

    if (jobs) {
      return (
        <div className="card-panel ">
          <div className="card-content black-text">
            <div className="card-action">
              <table className="striped hoverable">
                <thead>
                  <tr>
                    <th>Job No</th>
                    <th>Site</th>
                    <th>Department</th>
                    <th>Ward</th>
                    <th>Discription</th>
                    <th>Manager</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs
                    .filter(job => job.type === selectedTable)
                    .map(job => (
                      <tr key={job.id} className="hoverable">
                        <td>
                          <Link to={`/showuser/`}>{job.name}</Link>
                        </td>
                        <td>{job.site}</td>
                        <td>{job.dep}</td>
                        <td>{}</td>
                        <td>{job.name}</td>
                        <td>{}</td>
                        <td>{job.cost}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    return null;
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
)(Jobs);
