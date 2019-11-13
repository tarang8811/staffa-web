import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import Strings from '../../utilities/Strings'

const stripe =    window.Stripe('pk_test_hXktgS5TKCYejAlnTAaoG7ms00PukUgrpb');

export class CreateJob extends Component {
  state = {
    jobNo: "",
    name: "",
    site: "",
    dep: "",
    cost: "",
    showFundShift: false,
    showSubmitButton: false,
    latitude: "",
    longitude: ""
  };

  componentDidMount() {
    console.log(window.location.href)
    if(window.location.href.includes("response")) {
      let shiftData = localStorage.getItem('shiftData');
      if(!!shiftData) {
        this.setState(JSON.parse(shiftData))
        // localStorage.removeItem('shiftData')
      }
      if(window.location.href.includes("success")) {
        alert("Your shift has been funded")
        this.setState({showSubmitButton: true, showFundShift: false})
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
      uid: this.props.auth.uid,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    };
    console.log(itemAdd);
    // this.props.firestore.add({ collection: "jobs" }, itemAdd);

    fetch(`${Strings.BASE_URL}/saveJob`, {
      method: 'POST',
      body: JSON.stringify(itemAdd),
    }).then(response => {
      console.log(response)
      this.props.history.push("/jobboard");
    }).catch(err => {
      console.error(err);
    });

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
      body: JSON.stringify(orderData),
      }).then(response => {
        return response.json();
      }).then(data => {
        localStorage.setItem('shiftData', JSON.stringify(this.state));
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

  useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude
      }), 
      err => alert("Please share your location")
    );
  }

  useSavedLocation = () => {
    this.setState({ 
      latitude: this.props.profile.latitude, 
      longitude: this.props.profile.longitude
    })
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
                value={this.state.jobNo}
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
                value={this.state.name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="Name">Location:</label>
              <button onClick={this.useCurrentLocation} className="btn btn-success" style={{marginLeft: '10px', marginRight: '10px'}}>
                Use Current Location
              </button>
              <button onClick={this.useSavedLocation} className="btn btn-success" style={{marginRight: '10px'}}>
                Use Saved Location
              </button>
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
                value={this.state.site}
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
                value={this.state.dep}
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
                value={this.state.cost}
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
