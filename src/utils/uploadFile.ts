import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase/firebaseConfig"
import { replaceName } from "./replaceName"

export const uploadFile = async (file: any) => {
    // Change String (Ky tu)
    const fileName = replaceName(file.name)
    // Create Folder in Firebase
    const storageRef = ref(storage, `images/${fileName}`)
    // Timing await uploading file
    const res = await uploadBytes(storageRef, file)

    if (res) {
        if (res.metadata.size === file.size) {
            return getDownloadURL(storageRef)
        }
        else {
            return 'Uploading'
        }
    }
    else {
        return 'Error Upload File!'
    }
}