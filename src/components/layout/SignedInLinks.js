import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

const SignedInLinks = props => {
  return (
    <div>
      <ul className="right">
        <li>
          <NavLink to="/createjob">Post Shift</NavLink>
        </li>
        <li>
          <NavLink to="/jobboard">Jobs Board</NavLink>
        </li>
        <li>
          <NavLink to="/users">Users</NavLink>
        </li>
        <li>
          <NavLink to="/sites">Sites</NavLink>
        </li>
        <li>
          <NavLink to="/deps">Departments</NavLink>
        </li>
        <li>
          <NavLink to="/create">New Project</NavLink>
        </li>
        <li>
          <NavLink to="/messages">Messages</NavLink>
        </li>
        <li>
          <a onClick={props.signOut}>Log Out</a>
        </li>
        <li>
          <NavLink to="/" className="btn btn-floating blue lighten-1">
            {props.profile.initials}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SignedInLinks);
