// File: lib/sticker_func.js

import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

// 1. FUNGSI UPLOAD KE INTERNET (Catbox)
// Kita perlu upload dulu gambarnya biar bisa diconvert server lain
const uploadToCatbox = async (buffer) => {
    try {
        const type = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
        const bodyForm = new FormData();
        bodyForm.append("fileToUpload", buffer, "file." + type.ext);
        bodyForm.append("reqtype", "fileupload");

        const res = await axios.post("https://catbox.moe/user/api.php", bodyForm, {
            headers: {
                ...bodyForm.getHeaders(),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
        });
        return res.data; // Mengembalikan URL (https://files.catbox.moe/...)
    } catch (err) {
        console.error('Upload Failed:', err);
        throw new Error('Gagal upload media.');
    }
};

// 2. FUNGSI STICKER TO IMAGE (API Version)
// Tanpa FFMPEG, kita pakai Weserv buat convert
export const webpToImage = async (buffer) => {
    try {
        // Step A: Upload WebP ke Catbox
        const url = await uploadToCatbox(buffer);
        
        // Step B: Convert pakai Weserv (URL -> PNG)
        // Kita minta output=png
        const convertUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`;
        
        // Step C: Download hasilnya jadi Buffer lagi
        const res = await axios.get(convertUrl, { responseType: 'arraybuffer' });
        return res.data;
    } catch (e) {
        console.error('WebpToImage Error:', e);
        throw e;
    }
};

// 3. FUNGSI CREATE STICKER (Sticker Formatter)
export const createSticker = async (buffer, isVideo = false) => {
    try {
        // Metadata Stiker (Nama Pack & Author)
        const stickerMetadata = {
            pack: 'BloodSword Sticker',
            author: 'Zakky Bot',
            type: StickerTypes.FULL, // Stiker Full (Tidak terpotong)
            quality: 70
        };

        const sticker = new Sticker(buffer, stickerMetadata);
        return await sticker.toBuffer();
    } catch (e) {
        console.error('CreateSticker Error:', e);
        throw e;
    }
};