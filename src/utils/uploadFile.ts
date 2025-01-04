import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase/firebaseConfig"
import { replaceName } from "./replaceName"
import Resizer from "react-image-file-resizer";

export const uploadFile = async (f: any) => {
    const resizeFile: any = await handleResizeFile(f);
    if (resizeFile) {
        // Dổi tên file
        const fileName = replaceName(f.name)
        // Tham chiếu đến folder trong firebase
        const storageRef = ref(storage, `images/${fileName}-${Date.now()}`)
        // Upload lên firebase
        const res = await uploadBytes(storageRef, resizeFile)
        if (res) {
            if (res.metadata.size === resizeFile.size) {
                return getDownloadURL(storageRef) // Trả về URL tải về
            }
            else {
                return 'Uploading';
            }
        }
        else {
            return "Error Upload File!";
        }
    }
    else {
        return "Resize Failed";
    }
}

// Images will be resize before upload on firebase

// Hàm resize ảnh
export const handleResizeFile = async (file: any) => {
    return new Promise((resolve, reject) => {
        try {
            Resizer.imageFileResizer(
                file,         // File ảnh cần resize
                1080,         // Chiều rộng tối đa
                720,          // Chiều cao tối đa
                "JPEG",       // Định dạng ảnh sau khi nén
                80,           // Chất lượng ảnh (1 - 100)
                0,            // Góc xoay ảnh
                (newFile) => {
                    resolve(newFile); // Trả về ảnh đã resize
                },
                "file"        // Kiểu dữ liệu trả về
            );
        } catch (error) {
            reject(error); // Bắt lỗi nếu có vấn đề trong quá trình resize
        }
    });
};
