import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect, Link } from "react-router-dom";

export class Users extends Component {
  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    const { users } = this.props;
    if (users) {
      return (
        <div className="container">
          <div className="card-panel ">
            <div className="card-content black-text">
              <span className="card-title">User List</span>
              <br />
              <br />
              <br />
              <div className="card-action">
                <Link to="/adduser" className="btn">
                  Add New User
                </Link>
                <br />
                <br />
                <br />
                <table className="striped hoverable">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="hoverable">
                        <td>
                          <Link to={`/showuser/${user.id}`}>
                            {user.firstName}
                          </Link>
                        </td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);

  return {
    users: state.firestore.ordered.users,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "users",
      where: ["uid", "==", props.auth.uid]
    }
  ])
)(Users);
