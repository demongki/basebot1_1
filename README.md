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

Fokus utama bot ini adalah performa ringan tanpa fitur sampah yang memberatkan server.

## ✨ Fitur Unggulan

| Kategori | Fitur | Deskripsi |
| :--- | :--- | :--- |
| **🎨 Media** | `.sticker` / `.s` | Ubah Gambar/Video jadi Stiker WA |
| | `.toimg` | Ubah Stiker jadi Gambar (Jernih) |
| **🤖 AI & Pintar** | `.ai [tanya]` | Tanya Jawab Pintar (ChatGPT Style) |
| **🌍 Info Realtime** | `.gempa` | Info Gempa Terkini (Data BMKG) |
| **⚙️ System** | `.info` | Cek status Server (RAM, CPU, Platform) |
| | `.runtime` | Cek durasi bot menyala (Uptime) |
| | `.ping` | Cek kecepatan respon bot |
| | `.owner` | Menampilkan Kontak Pemilik Bot |

---

## 🚀 Cara Install

Pastikan kamu sudah menginstall **Node.js** dan **Git** di komputer kamu.

1.  **Clone Repository ini:**
    ```bash
    git clone [https://github.com/demongki/basebot1_1]
    cd basebot1_1
    ```

2.  **Install Module (Dependencies):**
    ```bash
    npm install
    ```

3.  **Jalankan Bot:**
    Disarankan menggunakan mode dev agar auto-restart saat ada error/perubahan.
    ```bash
    npm start
    ```

4.  **Login WhatsApp:**
    * Tunggu muncul kode pairing di terminal.
    * Buka WhatsApp di HP > Perangkat Tertaut > Tautkan Perangkat.
    * Masukkan kode pairing tersebut.

---

## ⚙️ Konfigurasi

Kamu bisa mengubah pengaturan dasar (Nama Owner, Nama Toko) di file `zakkyconfig.js`.

```javascript
global.ownerName = "Achmad Zakky Anwar"
global.namaStore = "BloodSword Store"
global.kontakOwner = "628xxxxxxxx"
