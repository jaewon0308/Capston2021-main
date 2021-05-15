import React from 'react'
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';

function SidePanel() {
    return (
        <div
            style={{
                backgroundColor: "black",
                padding: '0.1rem',
                minHeight: '100%',
                color: 'white',
                minWidth: '10%'
            }}
        >
            <UserPanel />

            <Favorited />

            <ChatRooms />

            <DirectMessages />
        </div>
    )
}

export default SidePanel
