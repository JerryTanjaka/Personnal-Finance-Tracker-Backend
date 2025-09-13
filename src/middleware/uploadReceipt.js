import multer from 'multer'
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { rm } from "fs/promises";

export const uploadReceipt =
    multer({
        limits: { files: 1, fileSize: (1_048_576 * parseFloat(process.env.MAX_RECEIPT_SIZE || 5)) },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join('src', 'data', 'receipts'));
            }, filename: (req, file, cb) => {
                cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`)
            }
        }),
        fileFilter: (req, file, cb) => {
            const [generalType, fileType] = file.mimetype.split('/')
            const acceptedFileType = ["jpg", "jpeg", "png", "pdf"]

            if (["image", "application"].includes(generalType)
                && acceptedFileType.includes(fileType)) {
                cb(null, true)
            } else { cb(null, false) }
        },
    }).single('receipt')

export const MulterErrorHandler = (err, req, res, next) => {
    if (err) {
        return res.status(400).json({ error: err.message })
    } else {
        next()
    }
}

export const deleteReceipt = async (receiptPath) => {
    await rm(receiptPath)
}