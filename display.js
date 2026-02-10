// File: display.js

import cfonts from 'cfonts';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import os from 'os';

// Fungsi hitung RAM & Uptime
const getSystemStats = () => {
    const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    const ramFree = (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    
    const uptime = os.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    return { ramTotal, ramFree, uptimeStr: `${uptimeHours} Jam ${uptimeMinutes} Menit` };
};

// Fungsi Utama Tampilan
export const showBanner = () => {
    console.clear();
    
    // 1. Banner Judul (BLOODSWORD STORE)
    cfonts.say(global.namaStore, {
        font: 'block',      // Font tebal seperti yang kamu kirim
        align: 'center',
        colors: ['red', 'white'], 
        background: 'transparent',
        letterSpacing: 1,
        lineHeight: 1,
        space: true,
        maxLength: '0',
    });

    // 2. Kotak Dashboard System
    const stats = getSystemStats();
    
    // Desain isi kotak
    const infoText = `
${chalk.bold.cyan('👑 Owner   :')} ${chalk.white(global.ownerName)}
${chalk.bold.green('📱 Status  :')} ${chalk.bold.green('ONLINE & ACTIVE')}
${chalk.bold.yellow('💻 RAM     :')} ${stats.ramFree} / ${stats.ramTotal}
${chalk.bold.blue('⏳ Uptime  :')} ${stats.uptimeStr}
${chalk.bold.magenta('🤖 Bot Name:')} ${global.botName}
    `.trim();

    // Render Kotak
    console.log(boxen(infoText, {
        padding: 1,
        margin: 0,
        borderStyle: 'double', // Garis ganda sesuai request
        borderColor: 'red',
        title: ' SYSTEM DASHBOARD ',
        titleAlignment: 'center'
    }));
    
    // Garis pembatas bawah
    console.log(gradient.passion('==================================================================\n'));
};