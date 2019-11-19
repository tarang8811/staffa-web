import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import FeeBoard from "./FeeBoard";

class Fees extends Component {
  state = {
    selectedTable: "Escrowed"
  };

  handleClick = e => {
    this.setState({
      selectedTable: e
    });
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs, payments } = this.props;
    let escrowedSize = 0;
    let pendingSize = 0;
    let paidSize = 0;
    let escrowed = []
    let pending = []
    let paid =[]
    if (jobs && payments) {
      jobs = jobs.map(j => j.d)
      escrowed = jobs
      pending = payments.filter(p => p.status === "PENDING");
      paid = payments.filter(p => p.type === "PAID");
      escrowedSize = escrowed.length;
      pendingSize = pending.length;
      paidSize = paid.length;
    }
    return (
      <div className="dashboard container">
        <div className="center">
          <table className="centered">
            <thead>
              <tr>
                <th>
                  <button
                    onClick={() => this.handleClick("Escrowed")}
                    className="btn btn-floating blue lighten-1 buttonC hoverable waves-effect waves-light"
                  >
                    {escrowedSize}
                  </button>
                  <h5 className="white">Escrowed Payment</h5>
                </th>
                <th>
                  <button
                    onClick={() => this.handleClick("Pending")}
                    className="btn btn-floating green lighten-1 buttonC hoverable waves-effect waves-light"
                  >
                    {pendingSize}
                  </button>
                  <h5 className="white">Pending Payment</h5>
                </th>
                <th>
                  <button
                    onClick={() => this.handleClick("Paid")}
                    className="btn btn-floating orange lighten-1 buttonC hoverable waves-effect waves-light"
                  >
                    {paidSize}
                  </button>
                  <h5 className="white">Paid Shifts</h5>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <FeeBoard 
          selectedTable={this.state.selectedTable} 
          jobs={jobs}
          payments={this.state.selectedTable === "Pending" ? pending : paid}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: state.firestore.ordered.jobs,
    payments: state.firestore.ordered.payments,
    auth: state.firebase.auth
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
    },
    {
      collection: "jobs",
      where: ["d.uid", "==", props.auth.uid]
    },
  ])
)(Fees);

