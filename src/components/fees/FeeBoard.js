import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { getBidsForJobId } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'

const JobTable = ({jobs, selectedTable}) => {
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
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .map(job => (
                  <tr key={job.id} className="hoverable">
                    <td>
                      <Link to={`/showuser/`}>{job.name}</Link>
                    </td>
                    <td>{job.d.site}</td>
                    <td>{job.d.dep}</td>
                    <td>{}</td>
                    <td>{job.d.name}</td>
                    <td>{}</td>
                    <td>{job.d.cost}</td>
                    <td>{job.d.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const PaymentTable = ({payments, selectedTable}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Approved Date</th>
                <th>Amount</th>
                <th>Freelancer Name</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .map(payment => (
                  <tr key={payment.id} className="hoverable">
                    <td>{payment.date}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.freelancerName}</td>
                    <td>{payment.paymentDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export class FeeBoard extends Component {

  state = {
  }


  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs, selectedTable, payments } = this.props;

    if(jobs && payments) {
      if(this.props.selectedTable === "Escrowed") {
        return <JobTable 
          jobs={jobs} 
          selectedTable={selectedTable}
        />
      } else {
        return <PaymentTable 
          payments={payments} 
          selectedTable={selectedTable} 
        />
      }
    }
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: state.firestore.ordered.jobs,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps)
)(FeeBoard);
