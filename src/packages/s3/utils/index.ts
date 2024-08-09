import axios from 'axios';
import path from 'path';
import { IUploadedMulterFile } from '../s3.service';

export function getFileExtension(filename: string) {
    if (!filename) return '';

    const extension = path.parse(filename).ext;
    return extension;
}

export async function readFileFromUrl(url: string) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return 'Can not read content file.';
    }
}

export const isVideo = (file: IUploadedMulterFile) => {
    if (file.mimetype.startsWith('video/')) {
        return true;
    }

    const fileExtension = getFileExtension(file.originalname).replace('.', '');
    const supportedExtensions = ['mp4', 'mpeg', 'mov'];
    if (supportedExtensions.includes(fileExtension)) {
        return true;
    }

    return false;
};
