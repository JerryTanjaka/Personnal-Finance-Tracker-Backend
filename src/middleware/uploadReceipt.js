import multer from 'multer'
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { rm } from "fs/promises";

export const uploadReceipt = multer({
    limits: { files: 1, fileSize: 2097152},
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join('src', 'data', 'receipts'));
        }, filename: (req, file, cb) => {
            cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        const acceptedFileType = ["jpg", "jpeg", "png", "pdf"]
        acceptedFileType.includes(file.mimetype.split('/')[1]) ? cb(null, true) : cb(null, false)
    }
})

export const deleteReceipt = async (receiptPath) => {
    await rm(receiptPath)
}