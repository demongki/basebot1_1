// File: index.js

import './zakkyconfig.js'; 
import { showBanner } from './display.js';
import { createSticker, webpToImage } from './lib/sticker_func.js';
import ssyoutube from './lib/scraper_yt.js'; 

import { 
    default as makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore,
    downloadMediaMessage,
    jidDecode
} from '@whiskeysockets/baileys';
import pino from 'pino';
import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen'; 
import axios from 'axios'; 
import os from 'os';

// --- FUNGSI MENGHITUNG WAKTU NYALA (RUNTIME) ---
const runtime = (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

const useQuestion = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(chalk.yellow(text), (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();
    
    const spinner = ora({ text: 'Menghubungkan ke BloodSword Server...', color: 'yellow' }).start();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        browser: ["BloodSword Contact", "Chrome", "20.0.04"],
        markOnlineOnConnect: true,
    });

    if (!sock.authState.creds.registered) {
        spinner.stop(); 
        console.clear();
        console.log(chalk.bold.red('\n🛑 BELUM LOGIN'));
        console.log(boxen('Silakan login menggunakan Pairing Code', { padding: 1, borderStyle: 'round', borderColor: 'yellow' }));

        const phoneNumber = await useQuestion(chalk.cyan('Masukan nomor Bot (628xxx): '));
        const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');

        if (!sanitizedPhone) process.exit(0);

        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(sanitizedPhone);
                console.log(chalk.bold('\nKode Pairing Anda:'));
                console.log(boxen(chalk.bgGreen.black.bold(` ${code?.match(/.{1,4}/g)?.join("-") || code} `), { borderStyle: 'classic', borderColor: 'green' }));
            } catch (err) {
                console.error(chalk.red("Gagal request kode."), err);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            spinner.fail(chalk.red('Koneksi Terputus!'));
            if (shouldReconnect) {
                console.log(chalk.yellow('Mencoba reconnect...'));
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            spinner.succeed(chalk.green('Terhubung!'));
            showBanner(); 
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            for (const msg of messages) {
                if (!msg.message) return;
                
                const remoteJid = msg.key.remoteJid;
                const isGroup = remoteJid.endsWith('@g.us');
                
                const body = (msg.message.conversation || 
                              msg.message.extendedTextMessage?.text || 
                              msg.message.imageMessage?.caption ||
                              msg.message.videoMessage?.caption ||
                              "").trim();

                const isCmd = body.startsWith('.') || body.startsWith('#'); 
                const command = isCmd ? body.slice(1).split(' ')[0].toLowerCase() : ''; 
                const args = body.trim().split(/ +/).slice(1); 
                const q = args.join(' '); 
                const pushName = msg.pushName || 'User';

                // --- LOG TERMINAL KEREN (DASHBOARD STYLE) ---
                if (body) {
                    // Ambil Jam Sekarang
                    const time = new Date().toLocaleTimeString('id-ID');
                    
                    // Tentukan Label (Perintah vs Chat Biasa)
                    const cmdLog = isCmd 
                        ? chalk.bgRed.white.bold(' ⚔️ COMMAND ') // Kalau Command, latar Merah
                        : chalk.bgBlue.white.bold(' 💬 MESSAGE '); // Kalau Chat biasa, latar Biru

                    // Tentukan Tipe Chat
                    const typeLog = isGroup 
                        ? chalk.bold.magenta('👥 GROUP') 
                        : chalk.bold.green('👤 PRIVATE');

                    // Tampilkan Log dalam bentuk Kotak
                    console.log(chalk.bold.cyan('╭──────────────────────────────────────────────────'));
                    console.log(`│ ${cmdLog} | ${chalk.yellow(time)} | ${typeLog}`);
                    console.log(`│ 👮 Dari: ${chalk.bold.white(pushName)}`);
                    console.log(`│ 📝 Isi : ${chalk.white(body)}`);
                    console.log(chalk.bold.cyan('╰──────────────────────────────────────────────────\n'));
                }

                switch (command) {

                    case 'menu':
                    case 'help':
                        const menuText = `
╭━━━[ ⚔️ *${global.namaStore}* ]━━━
┃ 👑 Owner: ${global.ownerName}
┃ 🤖 Bot: BloodSword System
╰━━━━━━━━━━━━━━━━━━━━

🟢 *SYSTEM MONITOR*
👉 .info (Cek RAM & Device)
👉 .runtime (Cek Waktu Nyala)
👉 .ping (Cek Sinyal)

🎨 *MEDIA TOOLS*
👉 .sticker / .s (Gambar ➡️ Stiker)
👉 .toimg (Stiker ➡️ Gambar)

🤖 *INTELLIGENCE*
👉 .ai [pertanyaan] (Tanya Bot)

_Powered by Baileys Multi-Device_
`;
                        // Tampilan Kartu Nama (Ad Reply)
                        await sock.sendMessage(remoteJid, { 
                            text: menuText,
                            contextInfo: {
                                externalAdReply: {
                                    title: "BloodSword Control Panel",
                                    body: "Klik untuk Chat Owner",
                                    thumbnailUrl: "https://files.catbox.moe/zt1r7j.jpg", 
                                    sourceUrl: `https://wa.me/${global.kontakOwner}`,
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }
                            }
                        }, { quoted: msg });
                        break;

                    // --- FITUR OWNER (REQUEST: CONTACT CARD) ---
                    case 'owner':
                    case 'creator':
                        // Format vCard (Standar Kartu Nama Internasional)
                        const vcard = 'BEGIN:VCARD\n' 
                            + 'VERSION:3.0\n' 
                            + `FN:${global.ownerName}\n` // Nama Lengkap
                            + `ORG:${global.namaStore};\n` // Nama Toko/Organisasi
                            + `TEL;type=CELL;type=VOICE;waid=${global.kontakOwner}:${global.kontakOwner}\n` // Nomor WA
                            + 'END:VCARD';

                        await sock.sendMessage(remoteJid, { 
                            contacts: { 
                                displayName: global.ownerName, 
                                contacts: [{ vcard }] 
                            }
                        }, { quoted: msg });
                        
                        await sock.sendMessage(remoteJid, { text: 'Tuh kontak Owner saya, jangan lupa di-save ya kak! 😉' }, { quoted: msg });
                        break;

                    // --- FITUR SYSTEM INFO ---
                    case 'info':
                    case 'device':
                    case 'status':
                        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
                        const totalRAM = Math.round(os.totalmem() / 1024 / 1024);
                        const cpus = os.cpus();
                        const userDetail = sock.user;
                        
                        const statusText = `
📱 *MULTI-DEVICE STATUS*

👤 *Nama Bot:* ${userDetail.name || 'BloodSword Bot'}
🆔 *ID Bot:* ${userDetail.id.split(':')[0]}
💻 *Platform:* ${os.platform()} (${os.arch()})
🧠 *CPU:* ${cpus[0].model}
💾 *RAM:* ${usedRAM} MB / ${totalRAM} MB
⏱️ *Uptime:* ${runtime(process.uptime())}
`;
                        await sock.sendMessage(remoteJid, { text: statusText }, { quoted: msg });
                        break;

                    case 'runtime':
                    case 'uptime':
                        await sock.sendMessage(remoteJid, { text: `⏱️ *Bot Aktif Selama:*\n${runtime(process.uptime())}` }, { quoted: msg });
                        break;

                    case 'ping':
                        const start = Date.now();
                        await sock.sendMessage(remoteJid, { text: '⚡' });
                        const end = Date.now();
                        await sock.sendMessage(remoteJid, { text: `Kecepatan Respon: *${end - start}ms*` }, { quoted: msg });
                        break;

                    case 'ai':
                        if (!q) return await sock.sendMessage(remoteJid, { text: 'Mau tanya apa boss?' }, { quoted: msg });
                        try {
                            const res = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(q)}`);
                            await sock.sendMessage(remoteJid, { text: res.data }, { quoted: msg });
                        } catch (e) {
                            await sock.sendMessage(remoteJid, { text: 'AI Error, coba lagi nanti.' }, { quoted: msg });
                        }
                        break;

                    case 'sticker':
                    case 's':
                        try {
                            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: pino({ level: 'silent' }) });
                            if (buffer) {
                                await sock.sendMessage(remoteJid, { text: '⏳ Sedang membuat stiker...' }, { quoted: msg });
                                const sticker = await createSticker(buffer, false); 
                                await sock.sendMessage(remoteJid, { sticker }, { quoted: msg });
                            } else {
                                await sock.sendMessage(remoteJid, { text: 'Kirim gambar dengan caption .sticker' }, { quoted: msg });
                            }
                        } catch (e) {
                            console.error(e);
                            await sock.sendMessage(remoteJid, { text: 'Gagal membuat stiker.' }, { quoted: msg });
                        }
                        break;

                    case 'toimg':
                        try {
                            const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
                            if (quoted && quoted.stickerMessage) {
                                await sock.sendMessage(remoteJid, { text: '⏳ Mengubah stiker ke gambar...' }, { quoted: msg });
                                const fakeMsg = { message: { stickerMessage: quoted.stickerMessage } };
                                const buffer = await downloadMediaMessage(fakeMsg, 'buffer', {}, { logger: pino({ level: 'silent' }) });
                                const img = await webpToImage(buffer);
                                await sock.sendMessage(remoteJid, { image: img, caption: 'Nih gambarnya!' }, { quoted: msg });
                            } else {
                                await sock.sendMessage(remoteJid, { text: 'Reply stiker dengan caption .toimg' }, { quoted: msg });
                            }
                        } catch (e) {
                           console.error(e);
                           await sock.sendMessage(remoteJid, { text: 'Gagal. Pastikan bukan stiker bergerak.' }, { quoted: msg });
                        }
                        break;
                       // --- FITUR SAFETY (INFO GEMPA BMKG) ---
                    case 'gempa':
                    case 'infogempa':
                        await sock.sendMessage(remoteJid, { react: { text: "🌍", key: msg.key } }); // Reaksi biar keren

                        try {
                            // Ambil data langsung dari BMKG (Format JSON)
                            const { data } = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
                            const gempa = data.Infogempa.gempa;

                            const teksGempa = `
🌋 *INFO GEMPA TERKINI*

📅 *Waktu:* ${gempa.Tanggal} | ${gempa.Jam}
📉 *Magnitudo:* ${gempa.Magnitude}
🌊 *Kedalaman:* ${gempa.Kedalaman}
📍 *Lokasi:* ${gempa.Wilayah}
⚠️ *Potensi:* ${gempa.Potensi}

_Sumber: BMKG Indonesia_
`;
                            // BMKG juga kasih gambar peta gempanya (Shakemap)
                            const imageGempa = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
                            
                            await sock.sendMessage(remoteJid, { image: { url: imageGempa }, caption: teksGempa }, { quoted: msg });
                        } catch (e) {
                            console.error(e);
                            await sock.sendMessage(remoteJid, { text: '❌ Gagal mengambil data BMKG.' }, { quoted: msg });
                        }
                        break;
                        // --- FITUR DOWNLOADER YOUTUBE (PREMIUM) ---
                    case 'yt':
                    case 'youtube':
                    case 'ytmp4':
                        if (!q) return await sock.sendMessage(remoteJid, { text: 'Linknya mana? Contoh: .yt https://youtu.be/xxxxx' }, { quoted: msg });

                        await sock.sendMessage(remoteJid, { react: { text: "⏳", key: msg.key } });

                        try {
                            const data = await ssyoutube.download(q);
                            
                            if (data.error) {
                                return await sock.sendMessage(remoteJid, { text: `❌ Error: ${data.error}` }, { quoted: msg });
                            }

                            // Kita cari kualitas terbaik (720p atau 360p)
                            // Filter yang ada audio-nya (karena kadang ada yg video doang tanpa suara)
                            const video = data.downloads.find(v => v.quality === '720' && !v.audio) || 
                                          data.downloads.find(v => v.quality === '360' && !v.audio) ||
                                          data.downloads[0];

                            if (!video || !video.url) {
                                return await sock.sendMessage(remoteJid, { text: '❌ Gagal mendapatkan link download.' }, { quoted: msg });
                            }

                            const captionYT = `
🎬 *YOUTUBE DOWNLOADER*

📌 *Judul:* ${data.meta.title}
⏱️ *Durasi:* ${data.meta.duration}
💾 *Size:* ${video.size}
🎞️ *Kualitas:* ${video.quality}p

_Sedang mengirim file..._
`;
                            // Kirim Videonya
                            await sock.sendMessage(remoteJid, { 
                                video: { url: video.url }, 
                                caption: captionYT 
                            }, { quoted: msg });

                        } catch (e) {
                            console.error(e);
                            await sock.sendMessage(remoteJid, { text: '❌ Gagal download. Link mungkin invalid atau server sibuk.' }, { quoted: msg });
                        }
                        break;
                }
            }
        }
    });
}

connectToWhatsApp();