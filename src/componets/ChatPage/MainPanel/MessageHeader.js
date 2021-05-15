import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { FaLockOpen } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import firebase from "../../../firebase";
import Media from 'react-bootstrap/Media';

function MessageHeader({ handleSearchChange }) {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const usersRef = firebase.database().ref("users")
    const [isFavorited, setIsFavorited] = useState(false)
    const userPosts = useSelector(state => state.chatRoom.userPosts)

    useEffect(() => {
        if (chatRoom && user) {
            addFavoriteListener(chatRoom.id, user.uid)
        }
    }, [])

    const addFavoriteListener = (chatRoomId, userId) => {
        usersRef
            .child(userId)
            .child("favorited")
            .once("value")
            .then(data => {
                if (data.val() !== null) {
                    const chatRoomIds = Object.keys(data.val());
                    const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
                    setIsFavorited(isAlreadyFavorited)
                }
            });
    };

    const handleFavorite = () => {
        if (isFavorited) {
            usersRef
                .child(`${user.uid}/favorited`)
                .child(chatRoom.id)
                .remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            setIsFavorited(prev => !prev)
        } else {
            usersRef
                .child(`${user.uid}/favorited`).update({
                    [chatRoom.id]: {
                        name: chatRoom.name,
                        description: chatRoom.description,
                        createdBy: {
                            name: chatRoom.createdBy.name,
                            image: chatRoom.createdBy.image
                        }
                    }
                });
            setIsFavorited(prev => !prev)
        }
    };

    const renderUserPosts = userPosts =>
        Object.entries(userPosts)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, val], i) => (
                <Media key={i}>
                    <img
                        style={{ borderRadius: '25px' }}
                        width={20}
                        height={20}
                        className="mr-3"
                        src={val.image}
                        alt={val.name}
                    />
                    <Media.Body>
                        <h6>{key}</h6>
                        <p>
                            {val.count} 개
                        </p>
                    </Media.Body>
                </Media>
            ))

            return (
                <div style={{
                    width: '95%',
                    height: '10%',
                    border: '0.3rem solid #bfbbbb',
                    borderRadius: '20px',
                    padding: '0.5rem',
                    marginBottom: '.5rem'
                }}>
                    <Container>
                        <Row >
                            <Col sm={4}>
                                <h5>
                                    {
                                        isPrivateChatRoom ?
                                            <FaLock style={{ marginBottom: '10px', fontSize:'.8rem', marginLeft: 6, marginTop: 3 }} />
                                            :
                                            <FaLockOpen style={{ marginBottom: '10px', fontSize:'1.2rem', marginLeft: 6, marginTop: 3  }} />
                                    }
                                    {" "}
                                    
                                    {chatRoom && chatRoom.name}
                                    
        
                                    {!isPrivateChatRoom &&
                                        <span style={{ cursor: 'pointer', fontSize:'1.5rem', marginLeft: 3}} onClick={handleFavorite}>
                                            {
                                                isFavorited ?
                                                    <MdFavorite style={{ borderBottom: '10px', fontSize:'1.5rem', marginBottom: 3 }} />
                                                    :
                                                    <MdFavoriteBorder style={{ borderBottom: '10px', fontSize:'1.5rem', marginBottom: 3 }} />
                                            }
                                        </span>
                                    }
        
                                </h5>
                            </Col>
                            <Col>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">
                                            <AiOutlineSearch />
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        onChange={handleSearchChange}
                                        placeholder="Search Messages"
                                        aria-label="Search"
                                        aria-describedby="basic-addon1"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
        
                        <Row >
                            <Col xs={8} md={5}>
                                <Accordion >
                                    <Card>
                                        <Card.Header style={{ padding: '0 1rem' }}>
                                            <Accordion.Toggle as={Button} variant="link" style={{ color: 'black', textDecoration: 'none' }} eventKey="0">
                                                Description
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body> {chatRoom && chatRoom.description}</Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
        
                            <Col xs={8} md={5}>
                                <Accordion >
                                    <Card>
                                        <Card.Header style={{ padding: '0 1rem' }}>
                                            <Accordion.Toggle as={Button} style={{ color: 'black', textDecoration: 'none' }} variant="link" eventKey="0">
                                                Posts Count
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {userPosts && renderUserPosts(userPosts)}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
        
                            <Col xs={2} md={2}>
                            {!isPrivateChatRoom &&
                            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize:'0.8rem' }} >
                                <p>
                                    <Image style={{ width: '20px', height: '20px', marginTop: 5 }}
                                        src={chatRoom && chatRoom.createdBy.image} roundedCircle />{" "}
                                    {chatRoom && chatRoom.createdBy.name}
                                </p>
                            </div>
                        }
                            </Col>
        
        
                        </Row>
                    </Container>
                </div>
            )
}

export default MessageHeader
