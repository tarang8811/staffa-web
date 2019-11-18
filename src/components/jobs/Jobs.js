import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";
import { getBidsForJobId } from '../../store/bidApi/bidApi'
import images from '../Themes/Images'
import { 
  getChatUID, isTopicExist, addNewTopicNode, setNewConversation, getUserData 
} from '../../store/messageApi/messagesApi'
import firebase from '../../config/fbConfig'

const JobTable = ({jobs, selectedTable, onShowBids}) => {
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
                <th>Date</th>
                <th></th>
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
                    <td>{job.date}</td>
                    <td>
                      {
                        job.type === "Vacant" ?
                        <button onClick={onShowBids(job)} className="btn btn-success" style={{marginLeft: '10px'}}>
                          Show bids
                        </button> :
                        <button onClick={onShowBids(job)} className="btn btn-success" style={{marginLeft: '10px'}}>
                          Show Hires
                        </button>
                      }
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

const BidsTable = ({bids, onShowJobs, onMessage, onHire, currentJob}) => {
  return (
    <div className="card-panel ">
      <div className="card-content black-text">
      <img
          style={{width: '30px'}}
          src={images.back}
          alt="icon send"
          onClick={onShowJobs}
      />
        <div className="card-action">
          <table className="striped hoverable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bid Price</th>
                <th>Freelancer Name</th>
                <th>Times</th>
                <th></th>
                {currentJob.type === "Vacant" &&
                  <th></th>
                }
              </tr>
            </thead>
            <tbody>
              {bids
                .map(bid => (
                  <tr key={bid.id} className="hoverable">
                    <td>{bid.date}</td>
                    <td>{bid.price}</td>
                    <td>{bid.freelancerName}</td>
                    <td>{bid.times.join(", ")}</td>
                    <td>
                      <button onClick={onMessage(bid)} className="btn btn-success">
                        Message
                      </button>
                    </td>
                    {
                      currentJob.type === "Vacant" &&
                      <td>
                        <button onClick={onHire(bid)} className="btn btn-success">
                          Hire
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

export class Jobs extends Component {

  state = {
    showBids: false,
    bids: [],
    currentJob: ""
  }

  onShowBids = (job) => () => {
    getBidsForJobId(job.id, (err, data) => {
      this.setState({showBids: true, bids: data, currentJob: job})
    })
  }

  onShowJobs = () => {
    this.setState({ showBids: false, bids: [], currentJob: ""})
  }

  onMessage = (bid) => () => {
    getUserData(bid.uid, (error, response) => {
      var chatUID = getChatUID(bid.uid, this.props.auth.uid, this.state.currentJob.name);
      response.id = bid.uid
      isTopicExist(chatUID, (exists) => {
        if (exists) {
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: this.state.currentJob.name
            }
          })
        } else {
          addNewTopicNode(this.state.currentJob.name, chatUID);
          setNewConversation(this.props.auth.uid, bid.uid, chatUID, this.state.currentJob.name);
          this.props.history.push({
            pathname: '/messages',
            state: {
              freelancer: response,
              topicName: this.state.currentJob.name
            }
          })
        }
      });
    })

    
  }

  onHire = (bid) => () => {
    const jobData = {
      ...this.state.currentJob,
      coordinates: new firebase.firestore.GeoPoint(this.state.currentJob.coordinates._lat, this.state.currentJob.coordinates._long),
      type: "Filled"
    }
    const bidData = {
      ...bid,
      approved: true
    }
    this.props.firestore.update({ collection: "jobs", doc: this.state.currentJob.id }, {d: jobData});
    this.props.firestore.update({ collection: "Bids", doc: bid.id }, bidData);
    this.props.handleClick("Filled")
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let { jobs, selectedTable } = this.props;
    if(jobs){
      jobs = jobs.map(j => {
        return {
          ...j.d,
          id: j.id
        }
      })
    }

    if (jobs && !this.state.showBids) {
      return <JobTable 
        jobs={jobs} 
        selectedTable={selectedTable} 
        onShowBids={this.onShowBids} 
      />
    }

    if(this.state.showBids) {
      return <BidsTable 
        bids={this.state.currentJob.type === "Vacant" 
          ? this.state.bids : this.state.bids.filter(b => b.approved)} 
        onShowJobs={this.onShowJobs}
        onMessage={this.onMessage}
        onHire={this.onHire}
        currentJob={this.state.currentJob}
      />
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
