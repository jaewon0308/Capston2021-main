import * as firebase from 'firebase/app';
import 'firebase/storage';

// 파일 전체 목록 부르기 + url 가져오기
export async function getThumbnail(dealiName) {
    const { items } = await firebase.storage().ref(`thumbnail/${dealiName}`).listAll();
    let thumbnaills = [];
    items.map((i) => {
        const { fullPath } = i;
        thumbnaills.push({
            url: firebase.storage().ref(fullPath).getDownloadURL(),
            fullPath,
        });
    })
    return thumbnaills;
}

// 파일 넣기
export function uploadFile(dealiName, file) {
    const ref = firebase.storage().ref(`thumbnail/${dealiName}/${file.name}`);
    return ref.put(file);
}
// 파일 삭제
export function deleteFile(fullPath) {
    return firebase.storage().ref(fullPath).delete();
}