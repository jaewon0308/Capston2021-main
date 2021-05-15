import React, { Component } from 'react'
import { FaRegSmile } from 'react-icons/fa';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import {
    setCurrentChatRoom, setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';
import Badge from 'react-bootstrap/Badge';

export class DirectMessages extends Component {

    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref("users"),
        users: [],
        activeChatRoom: "",
        connectedRef: firebase.database().ref(".info/connected"),
        presenceRef: firebase.database().ref("presence")

    }

    componentDidMount() {
        if (this.props.user) {
            this.addUsersListeners(this.props.user.uid)
        }
    }

    componentWillUnmount() {
        this.state.usersRef.off();
        this.state.presenceRef.off();
        this.state.connectedRef.off();
    }

    addUsersListeners = (currentUserUid) => {
        const { usersRef } = this.state;
        let usersArray = [];
        usersRef.on("child_added", DataSnapshot => {
            if (currentUserUid !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user)
                this.setState({ users: usersArray })
            }
        })
        this.state.connectedRef.on("value", DataSnapshot => {
            console.log('DataSnapshot', DataSnapshot.val())
            if (DataSnapshot.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);

                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
                ref.set(true);
            }
        });

        this.state.presenceRef.on("child_added", DataSnapshot => {
            if (currentUserUid !== DataSnapshot.key) {
                this.addStatusToUser(DataSnapshot.key);
            }
        });

        this.state.presenceRef.on("child_removed", DataSnapshot => {
            if (currentUserUid !== DataSnapshot.key) {
                this.addStatusToUser(DataSnapshot.key, false);
            }
        });
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user["status"] = `${connected ? "online" : "offline"}`;
            }
            return acc.concat(user);
        }, []);
        this.setState({ users: updatedUsers });
    };

    getChatRoomId = (userId) => {
        const currentUserId = this.props.user.uid

        return userId > currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`
    }

    changeChatRoom = (user) => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name
        }

        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.setActiveChatRoom(user.uid);
    }

    setActiveChatRoom = (userId) => {
        this.setState({ activeChatRoom: userId })
    }

    isUserOnline = user => user.status === "online";


    renderDirectMessages = users =>
        users.length > 0 &&
        users.map(user => (
            <li key={user.uid}
                style={{
                    backgroundColor: user.uid === this.state.activeChatRoom
                        && "#ffffff45"
                }}
                onClick={() => this.changeChatRoom(user)}>
                # {user.name}
                { <Badge variant={this.isUserOnline(user) ? "info" : "danger"}
                    style={{
                        height: '10px',
                        width: '10px',
                        float: 'right',
                        marginTop: '8px',
                        borderRadius: 10
                    }}
                >
                    {" "}
                </Badge>}
            </li>
        ))

    render() {
        const { users } = this.state;
        return (
            <div>
                <span style={{ display: 'flex', alignItems: 'center', fontSize:'0.8rem' }}>
                    <FaRegSmile style={{ marginRight: 3, fontSize: '0.8rem', marginLeft: 3}} />  DIRECT MESSAGES ({users.length})
                </span>

                <ul style={{ listStyleType: 'none', padding: 0, fontSize:'0.8rem', marginLeft: 3, marginTop: 3}}>
                    {this.renderDirectMessages(users)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessages);
