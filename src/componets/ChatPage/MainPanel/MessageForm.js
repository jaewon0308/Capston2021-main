import React, { useState, useRef, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import firebase from "../../../firebase";
import { useSelector } from 'react-redux';
import mime from "mime-types";

function MessageForm() {
    const [content, setContent] = useState("")
    const messagesRef = firebase.database().ref("messages")
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const storageRef = firebase.storage().ref()
    const inputOpenImageRef = useRef()
    const [percentage, setPercentage] = useState(0)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const typingRef = firebase.database().ref("typing");

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        };

        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content;
        }
        console.log('message', message)
        return message;
    };

    const handleKeyDown = event => {
        console.log('event.keyCode', event.keyCode)
        console.log('event.ctrlKey', event.ctrlKey)

        if (event.ctrlKey && event.keyCode === 13) {
            handleSubmit();
        }

        if (content) {
            typingRef
                .child(chatRoom.id)
                .child(user.uid)
                .set(user.displayName);
        } else {
            typingRef
                .child(chatRoom.id)
                .child(user.uid)
                .remove();
        }
    };

    const handleSubmit = async () => {
        console.log('aoiksdo')
        if (!content) {
            setErrors(prev => prev.concat("Type contents first"))
            return;

        }

        setLoading(true);

        try {
            await messagesRef
                .child(chatRoom.id)
                .push()
                .set(createMessage())

            typingRef
                .child(chatRoom.id)
                .child(user.uid)
                .remove();

            setErrors([])
            setContent("")
            setLoading(false)
        } catch (error) {
            console.error(error.message);
            setErrors(prev => prev.concat(error.message))
            setLoading(false)
        }
    };


    const getPath = () => {
        if (isPrivateChatRoom) {
            return `message/private/${chatRoom.id}`;
        } else {
            return "message/public";
        }
    };

    const handleUploadImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name) };

        setLoading(true)
        // 파일을 먼저 스토리지에 저장하기 
        let uploadTask = storageRef.child(filePath).put(file, metadata)
        // 파일 저장되는 퍼센티지 구하기 
        //on 의 1번쨰 인자, 두번째 인자(err) , 세번쨰 인자 (complete)
        uploadTask.on("state_changed",
            UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                );
                setPercentage(percentage);
            },
            err => {
                setLoading(false)
                console.error(err);
            },
            () => {
                // 저장이 다 된 후에 파일 메시지 전송
                // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        // // message collection에 파일 데이터 저장하기 
                        messagesRef
                            .child(chatRoom.id)
                            .push()
                            .set(createMessage(downloadURL))
                        setLoading(false)
                    })
            }
        )

    }

    return (
        <div>
            <div className = "textarea-sizing">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        onKeyDown={handleKeyDown}
                        value={content}
                        onChange={handleChange}
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
            </Form>
            </div>

            {!(percentage === 0 || percentage === 100) &&
                <ProgressBar
                    variant="warning"
                    label={`${percentage}%`}
                    now={percentage} />
            }
            <br />
            <div>
                {errors.map(errorMsg => <p style={{ color: 'red' }} key={errorMsg}>{errorMsg}</p>)}
            </div>

            <Row>
                <Col>
                    <button onClick={handleSubmit}
                        type="submit"
                        style={{ width: '70%', marginLeft:'3rem' }}
                        disabled={loading ? true : false}
                    >
                        SEND
                    </button>{' '}
                </Col>
                <Col>
                    <button onClick={handleOpenImageRef}
                        type="submit"
                        style={{ width: '70%', marginLeft:'3rem' }}
                        disabled={loading ? true : false}
                    >
                        UPLOAD
                     </button>{' '}
                </Col>
            </Row>

            <input
                type="file"
                accept="image/jpeg, image/png"
                ref={inputOpenImageRef}
                style={{ display: "none" }}
                onChange={handleUploadImage}
            />

        </div>
    )
}

export default MessageForm