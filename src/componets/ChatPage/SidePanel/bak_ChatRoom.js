import React, { useState, useEffect } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import { useSelector, useDispatch } from 'react-redux';
import firebase from "../../../firebase";
import {
    setCurrentChatRoom, setPrivateChatRoom,
} from '../../../redux/actions/chatRoom_action';

function ChatRooms() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser)
    const chatRoomsRef = firebase.database().ref("chatRooms")
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [chatRooms, setChatRooms] = useState([])
    const [activeChatRoomId, setActiveChatRoomId] = useState("")

    const [chatRoom, setChatRoom] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {

        AddChatRoomsListeners();

        return () => {
            chatRoomsRef.off();
        }

    }, [])

    const AddChatRoomsListeners = () => {
        let chatRommsArray = []
        // chatRoomsRef.on(eventType, callback)
        chatRoomsRef.on("child_added", DataSnapshot => {
            chatRommsArray.push(DataSnapshot.val());
            setTimeout(() => {
                setChatRooms(chatRommsArray);
                // 첫번째 chatRoom을 current chat room으로 
                dispatch(setCurrentChatRoom(chatRommsArray[0]))
                setActiveChatRoomId(chatRommsArray[0].id)
            }, 200);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid(name, description)) {
            addChatRoom();
        }
    }

    const addChatRoom = async () => {

        const key = chatRoomsRef.push().key;

        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        };

        try {
            await chatRoomsRef.child(key).update(newChatRoom);
            setName("");
            setDescription("");
            setShow(false)
        } catch (error) {
            alert(error)
        }

    };

    const changeChatRoom = (chatRoom) => {
        dispatch(setCurrentChatRoom(chatRoom));
        setActiveChatRoomId(chatRoom.id);
        dispatch(setPrivateChatRoom(false));
    }

    const renderChatrooms = chatRooms =>
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li
                key={room.id}
                onClick={() => changeChatRoom(room)}
                style={{
                    backgroundColor: room.id === activeChatRoomId && "#ffffff45"
                }}
            >
                # {room.name}
                <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">
                    0
                </Badge>
            </li>
        ));


    const isFormValid = (name, description) =>
        name && description;

    return (
        <>
            <span>CHAT ROOMS</span>
            {" "}({chatRooms.length})
            <AiOutlinePlus
                style={{ float: 'right', marginTop: '5px', cursor: 'pointer' }}
                onClick={handleShow}
            />

            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {renderChatrooms(chatRooms)}
            </ul>

            {/* ADD ChatRoom Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a chat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Enter chat room name"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                onChange={(e) => setDescription(e.target.value)}
                                type="text"
                                placeholder="Enter chat room description"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                        </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                        </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ChatRooms
