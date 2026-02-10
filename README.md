<div align="center">
<img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" alt="BloodSword Banner" width="100%" />

# ⚔️ BloodSword WhatsApp Bot

![NodeJS](https://img.shields.io/badge/Node.js-22.x-green?style=for-the-badge&logo=node.js)
![Baileys](https://img.shields.io/badge/Baileys-Multi%20Device-blue?style=for-the-badge&logo=whatsapp)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

**Simple, Fast, & Stable WhatsApp Bot built with Baileys Library.**
<br>
_Dikembangkan khusus untuk efisiensi, fitur media, dan manajemen otomatis._

[✨ Fitur](#-fitur-unggulan) • [🚀 Cara Install](#-cara-install) • [⚙️ Konfigurasi](#-konfigurasi)

</div>

---

## 📝 Deskripsi
**BloodSword Bot** adalah bot WhatsApp berbasis Node.js yang menggunakan library `@whiskeysockets/baileys`. Bot ini dirancang dengan arsitektur **Multi-Device** yang stabil, ringan, dan memiliki fitur "Auto-Restart" jika terjadi perubahan kode (Hot Reload).

Cocok untuk kebutuhan:
* Management Group & Store
* Konversi Media (Stiker/Gambar)
* AI Assistant
* Downloader & Tools Harian

## ✨ Fitur Unggulan

| Kategori | Fitur | Deskripsi |
| :--- | :--- | :--- |
| **🎨 Media** | `.sticker` / `.s` | Ubah Gambar/Video jadi Stiker WA |
| | `.toimg` | Ubah Stiker jadi Gambar (Jernih) |
| **🤖 AI & Pintar** | `.ai [tanya]` | Tanya Jawab Pintar (ChatGPT Style) |
| | `.wiki [query]` | Cari artikel Wikipedia Indonesia |
| | `.tr [bahasa]` | Terjemahkan teks otomatis |
| **📥 Downloader** | `.yt [link]` | Download Video YouTube (Tanpa Iklan) |
| **🛠️ Tools** | `.qr [teks]` | Buat QR Code instan |
| | `.short [link]` | Pendekkan link panjang (Shortlink) |
| | `.gempa` | Info Gempa Terkini (Realtime BMKG) |
| **🕌 Islami** | `.sholat [kota]` | Jadwal Sholat sesuai lokasi |
| | `.ngaji` | Tampilkan ayat Al-Qur'an acak |
| **🎮 Fun Games** | `.suit` | Adu suit lawan Bot |
| | `.slot` | Game keberuntungan Slot Machine |
| | `.cekkhodam` | Cek khodam (Just for fun) |
| **⚙️ System** | `.info` | Cek status Server (RAM, CPU, Uptime) |
| | `.dev` | Mode Developer (Live Code Detective) |

---

## 🚀 Cara Install

Pastikan kamu sudah menginstall **Node.js** dan **Git** di komputer kamu.

1.  **Clone Repository ini:**
    ```bash
    git clone [https://github.com/UsernameKamu/BloodSword-Bot.git](https://github.com/UsernameKamu/BloodSword-Bot.git)
    cd BloodSword-Bot
    ```

2.  **Install Module (Dependencies):**
    ```bash
    npm install
    ```

3.  **Jalankan Bot:**
    Kamu bisa menggunakan perintah start biasa atau mode developer (auto-restart).
    ```bash
    npm start
    ```

4.  **Login WhatsApp:**
    * Tunggu muncul kode pairing di terminal.
    * Buka WhatsApp di HP > Perangkat Tertaut > Tautkan Perangkat.
    * Masukkan kode pairing tersebut.

---

## ⚙️ Konfigurasi

Kamu bisa mengubah pengaturan dasar di file `zakkyconfig.js` atau di bagian atas `index.js`:

```javascript
global.ownerName = "Achmad Zakky Anwar"
global.namaStore = "BloodSword Store"
global.kontakOwner = "628xxxxxxxx" // Ganti dengan nomormu
