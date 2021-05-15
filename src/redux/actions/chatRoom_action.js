import {
    SET_CURRENT_CHAT_ROOM,
    SET_PRIVATE_CHAT_ROOM,
    SET_USER_POSTS
} from './types';

export function setCurrentChatRoom(currentChatRoom) {
    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: currentChatRoom
    }
}

export const setPrivateChatRoom = isPrivateChatRoom => {
    return {
        type: SET_PRIVATE_CHAT_ROOM,
        payload: isPrivateChatRoom
    };
};


export const setUserPosts = userPosts => {
    return {
        type: SET_USER_POSTS,
        payload: userPosts
    };
};


