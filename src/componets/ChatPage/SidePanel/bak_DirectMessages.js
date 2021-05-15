import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import firebase from "../../../firebase";

function DirectMessages() {
    const user = useSelector(state => state.user.currentUser)
    const usersRef = firebase.database().ref("users")
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (user) {
            addUsersListeners(user.uid);
        }
    }, [user])

    const addUsersListeners = currentUserUid => {
        let usersArray = [];
        usersRef.on("child_added", DataSnapshot => {
            if (currentUserUid !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user);
                setTimeout(() => {
                    setUsers(usersArray)
                }, 100);
            }
        })
    }

    const renderDirectMessages = (users) => users.length > 0 &&
        users.map(user => (
            <li
                key={user.uid}
            >
                # {user.name}
            </li>
        ));

    return (
        <>
            <span>
                DIRECT MESSAGES ({users.length})
            </span>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {renderDirectMessages(users)}
            </ul>
        </>
    )
}

export default DirectMessages
