import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

const stripe =    window.Stripe('pk_test_hXktgS5TKCYejAlnTAaoG7ms00PukUgrpb');

export class CreateJob extends Component {
  state = {
    jobNo: "",
    name: "",
    site: "",
    dep: "",
    cost: "",
    showFundShift: false,
    showSubmitButton: false
  };

  componentDidMount() {
    if(!!this.props.match.params.response) {
      const response = this.props.match.params.response
      if(response == 'success') {
        this.setState({showSubmitButton: true})
      } else {
        alert('Payment failed. Please try again')
      }
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const itemAdd = {
      jobNo: this.state.jobNo,
      name: this.state.name,
      site: this.state.site,
      dep: this.state.dep,
      cost: this.state.cost,
      type: "Vacant",
      uid: this.props.auth.uid
    };
    console.log(itemAdd);
    this.props.firestore.add({ collection: "jobs" }, itemAdd);

    this.props.history.push("/jobboard");
  };

  onFund = e => {
    e.preventDefault();

    const orderData = {
      name: this.state.name,
      amount: this.state.cost,
      customerId: this.props.profile.stripe_id
    }

    // Url to Firebase function
    fetch('https://us-central1-staffa-13e8a.cloudfunctions.net/createCheckoutSession/', {
      method: 'POST',
      body: JSON.stringify(orderData)
      }).then(response => {
        return response.json();
      }).then(data => {
        // Redirecting to payment form page
        stripe.redirectToCheckout({
          sessionId: data.sessionId
        }).then(function (result) {
          result.error.message
        });
      });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    }, this.handleStateUpdate);
  };

  handleStateUpdate = () => {
    const showFundShift = !!this.state.name && !!this.state.cost
    this.setState({ showFundShift })
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <div className="card-panel ">
          <span className="card-title">Add New Shift</span>
          <br />
          <br />
          <br />
          <div className="card-action" />
          <Link to="/jobboard" className="btn">
            Back to JobBoard
          </Link>
          <div className="panel-body">
            <div className="form-group">
              <label htmlFor="Job No">Job Number:</label>
              <input
                type="text"
                className="form-control"
                name="jobNo"
                id="jobNo"
                onChange={this.handleChange}
                placeholder="Type Job Number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Name">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                id="name"
                onChange={this.handleChange}
                placeholder="Type Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Site">Site:</label>
              <input
                type="text"
                className="form-control"
                name="site"
                id="site"
                onChange={this.handleChange}
                placeholder="Type Site"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Department">Department:</label>
              <input
                type="text"
                className="form-control"
                name="dep"
                id="dep"
                onChange={this.handleChange}
                placeholder="Type Department Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="Cost">Cost:</label>
              <input
                type="text"
                className="form-control"
                name="cost"
                id="cost"
                onChange={this.handleChange}
                placeholder="Type Cost"
              />
            </div>
            {
              this.state.showFundShift && 
              <button onClick={this.onFund} className="btn btn-success" style={{marginRight: '10px'}}>
                Fund Shift
              </button>
            }
            {
              this.state.showSubmitButton && 
              <button onClick={this.onSubmit} className="btn btn-success">
                Submit
              </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //console.log(state);

  return {
    //deps: state.firestore.data.deps,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "jobs"
    }
  ])
)(CreateJob);
