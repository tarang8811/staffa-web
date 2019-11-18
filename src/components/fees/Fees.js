import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";

export class Fees extends Component {
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { payments } = this.props;

    if (payments) {
      return (
        <div className="dashboard container">
          <div className="card-panel ">
            <div className="card-content black-text">
              <div className="card-action">
                <table className="striped hoverable">
                  <thead>
                    <tr>
                      <th>Paid Date</th>
                      <th>Amount</th>
                      <th>Freelancer Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments
                      .map(payment => (
                        <tr key={payment.id} className="hoverable">
                          <td>{payment.date}</td>
                          <td>{payment.amount}</td>
                          <td>{payment.freelancerName}</td>    
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    payments: state.firestore.ordered.payments,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "payments",
      where: [
        "agencyId", "==", props.auth.uid
      ]
    }
  ])
)(Fees);
