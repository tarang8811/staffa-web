import React, {Component} from 'react'
// import ReactLoading from 'react-loading'
import WelcomeBoard from './WelcomeBoard/WelcomeBoard'
import './MessageScreen.css'
// import ChatBoard from './ChatBoard/ChatBoard'
import { connect } from "react-redux";
import { 
  getUserConversationNodeForChat, 
  isUserConversationExist, 
  getUserData,
  getConversationMessagesNode
} from '../../store/messageApi/messagesApi'

class MessageScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            currentPeerUser: null,
            users: []
        }
        this.currentUserId = props.auth.uid
        // this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
        this.currentUserNickname = 'My Nick Name'
        this.listUser = []
    }

    componentDidMount() {
      this.setState({ isLoading: true });
      var userConversationNode = getUserConversationNodeForChat(this.currentUserId);
      this.userConversations = userConversationNode.onSnapshot(this.onCollectionUpdate);

      isUserConversationExist(this.currentUserId,(exists) => {
        if(!exists){
          this.setState({ isLoading: false });
        }
      });
    }

    onCollectionUpdate = (querySnapshot) => {
      var screen = this;
      var userData = [];
      var totalData = querySnapshot.size;
      querySnapshot.forEach((doc) => {
        if(doc.exists){
          const data = doc.data();
          console.log("ChatView onCollectionUpdate  receiverID : " + data.receiverID + " N chatUID : " + doc.id);
          getUserData(data.receiverID, (error, response) => {
            if (!error) {
              response.id = data.receiverID;
              var singleUser = { chatUID: doc.id, singleMessage: {}, topicName: data.topicName, user: response };
              if (data.lastMessageID === "") {
                userData.push(singleUser);
                if (userData.length === totalData) {
                  screen.setState({ users: userData });
                  screen.setState({ isLoading: false });
                }
              } else {
                var chatRef = getConversationMessagesNode(doc.id).doc(data.lastMessageID);
                chatRef.onSnapshot(function (doc) {
                  singleUser.singleMessage = doc.data();
                  userData.push(singleUser);
                  console.log("ChatView onCollectionUpdate userData.length : " + userData.length + " N " + totalData);
                  if (userData.length === totalData) {
                    screen.setState({ users: userData });
                    screen.setState({ isLoading: false });
                  }
                });
              }
            }
          });
        } else {
          screen.setState({ isLoading: false });
        }
      });
    }

    renderListUser = () => {
        if (this.state.users.length > 0) {
            let viewListUser = []
            this.state.users.forEach((item, index) => {
                if (item.user.id !== this.currentUserId) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                this.state.currentPeerUser.id === item.user.id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.setState({currentPeerUser: item.user})
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.user.bio.profilePic}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                <span className="textItem">{`Name: ${
                    item.user.registerData.firstName
                    }`}</span>
                                <span className="textItem">{
                                    item.singleMessage && item.singleMessage.message ? item.singleMessage.message : ''
                                    }</span>
                            </div>
                        </button>
                    )
                }
            })
            return viewListUser
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="root">
                {/* Header */}
                <div className="header">
                    <span>Messages</span>
                    <img
                        className="icProfile"
                        alt="An icon default avatar"
                        // src={images.ic_default_avatar}
                        onClick={this.onProfileClick}
                    />
                </div>

                {/* Body */}
                <div className="body">
                    <div className="viewListUser"> {this.renderListUser()}</div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <ChatBoard
                                currentPeerUser={this.state.currentPeerUser}
                                showToast={this.props.showToast}
                            />
                        ) : (
                            <WelcomeBoard
                                currentUserNickname={this.currentUserNickname}
                                currentUserAvatar={this.currentUserAvatar}
                            />
                        )}
                    </div>
                </div>


                {/* Loading */}
                {/* {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null} */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen)
