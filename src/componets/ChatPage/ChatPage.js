import React from 'react'
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';
import { useSelector } from 'react-redux';



function ChatPage() {
    const currentUser = useSelector(state => state.user.currentUser)
    const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    return (

        <div style={{ display: 'flex' }}>

            <div style={{ width: '13%' }}>
                <SidePanel
                    key={currentUser && currentUser.uid}
                />
            </div>
            <div style={{ width: '95%' }}>
                <MainPanel
                    key={currentChatRoom && currentChatRoom.id}
                />

                

            </div>
        </div>



    )
}

export default ChatPage

