import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { getBidsForJobId } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'
import {  
  getUserData,
  addNewTopicNode,
  setNewConversation,
  isTopicExist,
  getChatUID
} from '../../store/messageApi/messagesApi'

const JobTable = ({jobs, onMessageAgency}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Job Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Agency Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .map(job => (
                  <tr key={job.id} className="hoverable">
                    <td>{job.d.name}</td>
                    <td>{job.d.cost}</td>
                    <td>{job.d.date}</td>
                    <td>{job.d.agencyName}</td>
                    <td>
                      <button onClick={onMessageAgency({agencyId: job.uid, jobName: job.d.name})} className="btn btn-success">
                      Message Agency
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const PaymentTable = ({payments, selectedTable, onMessageAgency, onMessageFreelancer, onApprovePayment}) => {
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
                <th>Agency Name</th>
                {
                  selectedTable === "Paid" &&
                  <th>Payment Date</th>
                }
                <th></th>
                <th></th>
                {
                  selectedTable === "Pending" &&
                  <th></th>
                }
              </tr>
            </thead>
            <tbody>
              {payments
                .map(payment => (
                  <tr key={payment.id} className="hoverable">
                    <td>{payment.date}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.freelancerName}</td>
                    <td>{payment.agencyName}</td>
                    {
                      selectedTable === "Paid" &&
                      <th>{payment.paymentDate}</th>
                    }
                    <td>
                      <button onClick={onMessageAgency(payment)} className="btn btn-success">
                      Message Agency
                      </button>
                    </td>
                    <td>
                      <button onClick={onMessageFreelancer(payment)} className="btn btn-success">
                      Message Freelancer
                      </button>
                    </td>
                    {
                      selectedTable === "Pending" &&
                      <td>
                          <button onClick={onApprovePayment(payment)} className="btn btn-success">
                        Approve Payment
                          </button>
                        </td>
                    }
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

  onMessageAgency = (payment) => () => {
    getUserData(payment.agencyId, (error, response) => {
      var chatUID = getChatUID(payment.agencyId, this.props.auth.uid, payment.jobName);
      response.id = payment.agencyId
      isTopicExist(chatUID, (exists) => {
        if (exists) {
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        } else {
          addNewTopicNode(payment.jobName, chatUID);
          setNewConversation(this.props.auth.uid, payment.agencyId, chatUID, payment.jobName);
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        }
      });
    })
  }

  onMessageFreelancer = (payment) => () => {
    getUserData(payment.freelancerId, (error, response) => {
      var chatUID = getChatUID(payment.freelancerId, this.props.auth.uid, payment.jobName);
      response.id = payment.freelancerId
      isTopicExist(chatUID, (exists) => {
        if (exists) {
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        } else {
          addNewTopicNode(payment.jobName, chatUID);
          setNewConversation(this.props.auth.uid, payment.freelancerId, chatUID, payment.jobName);
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: payment.jobName
            }
          })
        }
      });
    })
  }

  onApprovePayment = (payment) => {

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
          onMessageAgency={this.onMessageAgency}
        />
      } else {
        return <PaymentTable 
          payments={payments} 
          selectedTable={selectedTable}
          onMessageAgency={this.onMessageAgency}
          onMessageFreelancer={this.onMessageFreelancer}
          onApprovePayment={this.onApprovePayment} 
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
