import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import firebase from "../../../firebase";
import Message from './Message';

function MessageBody() {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const messagesRef = firebase.database().ref("messages")
    const [messages, setMessages] = useState([]);
    const [messageLoading, setMessageLoading] = useState(true);

    useEffect(() => {

        if (chatRoom) {
            AddMessagesListeners(chatRoom.id);
        }

        return () => {
            messagesRef.off();
        }

    }, [chatRoom])

    const AddMessagesListeners = (chatRoomId) => {
        let messagesArray = []
        //방 이동 후 Message state을 초기화시켜주기
        setMessages([]);
        messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            setTimeout(() => {
                setMessages(messagesArray);
                setMessageLoading(false);
            }, 500);

        });
    }

    const renderMessages = (messages) =>
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={user}
            />
        ))

    return (
        <div style={{
            width: '100%',
            height: '450px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '2rem',
            overflowY: 'auto'
        }}>
            {console.log('message Rendered', messages)}
            {renderMessages(messages)}
        </div>
    )
}

export default MessageBody

