import React, {Component} from 'react'
import './WelcomeBoard.css'

export default class WelcomeBoard extends Component {
    render() {
        return (
            <div className="viewWelcomeBoard">
        <span className="textTitleWelcome">{`Welcome, ${
            this.props.currentUserNickname
            }`}</span>
                <span className="textDesciptionWelcome">
          Let's start talking. Great things might happen.
        </span>
            </div>
        )
    }
}