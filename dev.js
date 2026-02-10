// File: dev.js
// INI ADALAH ALAT PELUNCUR BOT PINTAR

import chokidar from 'chokidar';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { diffLines } from 'diff';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variabel untuk menyimpan isi file terakhir (biar bisa dibandingin)
let fileCache = {};
let botProcess = null;

// Fungsi untuk menjalankan Bot (index.js)
const startBot = () => {
    if (botProcess) {
        process.stdout.write(chalk.yellow('🔄 Merestart Bot...\n'));
        botProcess.kill(); // Matikan bot lama
    }

    // Jalankan: node index.js
    botProcess = spawn('node', ['index.js'], { stdio: 'inherit' });

    botProcess.on('close', (code) => {
        if (code === null) return; // Dibunuh manual
        console.log(chalk.red(`Bot mati dengan kode: ${code}`));
    });
};

// Fungsi Detektif: Cek apa yang berubah?
const checkDiff = (filePath) => {
    const fileName = path.basename(filePath);
    
    // Baca isi file yang baru di-save
    const newContent = fs.readFileSync(filePath, 'utf-8');
    
    // Ambil isi file yang lama dari memori
    const oldContent = fileCache[filePath] || "";

    // Kalau ini pertama kali jalan, simpan aja ke memori tanpa bandingin
    if (!fileCache[filePath]) {
        fileCache[filePath] = newContent;
        return;
    }

    // Bandingkan!
    const changes = diffLines(oldContent, newContent);
    let lineCounter = 1;
    let hasChanges = false;

    console.log(chalk.bold.cyan(`\n📝 TERDETEKSI PERUBAHAN DI: ${fileName}`));
    console.log(chalk.gray('--------------------------------------------------'));

    changes.forEach((part) => {
        // Hitung baris
        const count = part.count || 0;
        
        if (part.added) {
            // Kalau ada baris baru (Hijau)
            process.stdout.write(chalk.green(`➕ Baris ${lineCounter}: ${part.value.trim()}\n`));
            hasChanges = true;
        } else if (part.removed) {
            // Kalau ada baris dihapus (Merah)
            process.stdout.write(chalk.red(`➖ Baris ${lineCounter}: ${part.value.trim()}\n`));
            hasChanges = true;
        } else {
            // Kalau tidak berubah, cuma nambah counter baris
            lineCounter += count;
        }
    });

    console.log(chalk.gray('--------------------------------------------------'));

    // Simpan isi file baru ke memori buat perbandingan selanjutnya
    fileCache[filePath] = newContent;

    // Kalau ada yang berubah, Restart Bot!
    if (hasChanges) {
        startBot();
    }
};

// --- SETTING MATA-MATA (WATCHER) ---
// Kita awasi semua file .js, TAPI abaikan folder sesi & node_modules
const watcher = chokidar.watch(['**/*.js'], {
    ignored: ['node_modules', 'auth_info_baileys', 'dev.js'], 
    persistent: true,
    ignoreInitial: true // Jangan cek diff pas baru pertama nyala
});

// Load isi file awal ke memori dulu
const initCache = () => {
    const files = ['index.js', 'zakkyconfig.js', 'display.js', 'lib/sticker_func.js']; // Daftar file utama
    files.forEach(f => {
        if(fs.existsSync(f)) {
            fileCache[path.resolve(__dirname, f)] = fs.readFileSync(f, 'utf-8');
        }
    });
};

// --- JALANKAN PROGRAM ---
console.clear();
console.log(chalk.bold.blue('🕵️  MODE DETEKTIF KODE AKTIF!'));
console.log(chalk.cyan('Silakan ubah codingan, saya akan lapor perubahannya...'));
console.log('');

initCache(); // Simpan memori awal
startBot();  // Nyalakan bot pertama kali

// Kalau ada file berubah -> Lapor & Restart
watcher.on('change', (path) => checkDiff(path));