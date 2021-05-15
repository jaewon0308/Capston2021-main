import React, { useState, useEffect } from 'react'
import firebase from "../../../firebase";
import { useDispatch } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

function Favorited({ currentUser }) {
    const dispatch = useDispatch();
    const [favoritedChatRooms, setFavoritedChatRooms] = useState([])
    const usersRef = firebase.database().ref("users")
    const [activeChatRoomId, setActiveChatRoomId] = useState("")

    useEffect(() => {
        if (currentUser) {
            addListeners(currentUser.uid);
        }
    }, [])

    const addListeners = userId => {
        usersRef
            .child(userId)
            .child("favorited")
            .on("child_added", DataSnapshot => {
                const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val() };
                setFavoritedChatRooms(prev => prev.concat(favoritedChatRoom))
            });

        usersRef
            .child(userId)
            .child("favorited")
            .on("child_removed", DataSnapshot => {
                const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val() };

                const filteredChatRooms = favoritedChatRooms.filter(chatRoom => {
                    return chatRoom.id !== chatRoomToRemove.id;
                });
                setFavoritedChatRooms(filteredChatRooms);
            });
    }

    const changeChatRoom = (chatRoom) => {
        dispatch(setCurrentChatRoom(chatRoom));
        setActiveChatRoomId(chatRoom.id);
        dispatch(setPrivateChatRoom(false));
    }

    const renderFavoritedChatRooms = (favoritedChatRooms) =>
        favoritedChatRooms.length > 0 &&
        favoritedChatRooms.map(chatRoom => (
            <li
                key={chatRoom.id}
                onClick={() => changeChatRoom(chatRoom)}
                style={{
                    backgroundColor: chatRoom.id === activeChatRoomId && "#ffffff45"
                }}
            >
                # {chatRoom.name}
            </li >
        ));


    return (
        <>
            <span>
                FAVORITED ({favoritedChatRooms.length})
            </span>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {renderFavoritedChatRooms(favoritedChatRooms)}
            </ul>
        </>
    )
}

export default Favorited
