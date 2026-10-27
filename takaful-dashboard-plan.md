# Pelan Pembinaan: Dashboard Pengurusan Takaful Pelajar PMJB

## Gambaran Keseluruhan

Bina sebuah web app HTML/CSS/JavaScript yang berjalan sepenuhnya di pelayar (browser) tanpa memerlukan pelayan (server) atau pangkalan data luaran. Data disimpan dalam fail JSON yang boleh diimport/eksport. Sistem ini direka untuk seorang pegawai insurans PMJB bagi memantau status pembayaran takaful pelajar, mengesan pelajar yang tercicir (repeat, extend, junior), dan menguruskan rekod merentas semester.

**Pengguna Sasaran:** Satu (1) pegawai insurans Politeknik  
**Saiz Data:** Kurang dari 500 pelajar  
**Bahasa Antaramuka:** Bahasa Melayu sepenuhnya  
**Teknologi:** HTML5, CSS3, Vanilla JavaScript, JSON (localStorage + eksport/import fail)

---

## Senarai Sub-Tugas

---

### Sub-Tugas 1: Struktur Projek & Reka Bentuk Asas

**Intent:**  
Sediakan struktur folder projek, fail HTML utama, dan gaya CSS asas termasuk reka bentuk warna, tipografi, dan susun atur (layout) dashboard.

**Expected Outcomes:**
- Folder projek `takaful-dashboard/` wujud dengan struktur fail yang betul
- Halaman utama `index.html` boleh dibuka di browser
- Reka bentuk asas dengan warna rasmi (biru/hijau kerajaan) kelihatan bersih dan profesional
- Bar navigasi atas dan menu sisi (sidebar) berfungsi

**Todo List:**
- [ ] Cipta struktur folder: `takaful-dashboard/`, `css/`, `js/`, `data/`, `assets/`
- [ ] Bina `index.html` dengan kerangka HTML5 asas
- [ ] Bina `css/style.css` dengan tema warna, fon, dan susun atur grid
- [ ] Bina bar navigasi atas dengan nama sistem "Dashboard Takaful Pelajar PMJB"
- [ ] Bina sidebar navigasi dengan pautan ke semua modul
- [ ] Pastikan reka bentuk responsif (boleh guna di skrin laptop standard)

**Relevant Context:**
- Tiada framework CSS — guna CSS tulen supaya mudah diselenggara
- Warna cadangan: biru gelap (#1a3a5c) untuk header, putih untuk kandungan, kuning/oren untuk amaran

**Status:** [ ] pending

---

### Sub-Tugas 2: Struktur Data & Pengurusan JSON

**Intent:**  
Tentukan skema data JSON untuk rekod pelajar dan laksanakan fungsi baca/tulis menggunakan localStorage browser sebagai storan utama, dengan sokongan import/eksport fail JSON.

**Expected Outcomes:**
- Skema JSON pelajar yang lengkap dan konsisten digunakan di seluruh sistem
- Data kekal tersimpan dalam localStorage apabila browser ditutup dan dibuka semula
- Fungsi import fail JSON (untuk muatkan data) dan eksport fail JSON (untuk backup) berfungsi

**Todo List:**
- [ ] Tentukan skema JSON satu rekod pelajar (lihat Skema di bawah)
- [ ] Cipta `data/contoh-pelajar.json` dengan 10 rekod contoh merangkumi pelbagai status
- [ ] Bina `js/dataManager.js` — fungsi simpan, baca, kemaskini, padam rekod dari localStorage
- [ ] Bina fungsi `importJSON()` — membenarkan pegawai muat naik fail JSON dari komputer
- [ ] Bina fungsi `eksportJSON()` — memuat turun semua data sebagai fail JSON untuk backup
- [ ] Bina fungsi `eksportCSV()` — memuat turun data dalam format CSV untuk laporan Excel

**Skema Rekod Pelajar (JSON):**
```
{
  "id": "22DKM01234",           -- No. matrik (unik, kunci utama)
  "nama": "Nama Penuh",
  "no_ic": "001234-56-7890",
  "program": "DKM",
  "semester_masuk": "Sem 1 2022/2023",
  "kelas_semasa": "DKM2A",
  "kelas_asal": "DKM3B",        -- kelas sepatutnya jika tiada masalah
  "semester_semasa": "Sem 4 2024/2025",
  "semester_asal": "Sem 6 2024/2025",  -- semester sepatutnya
  "status_pengajian": "repeat", -- aktif | repeat | extend | junior | tangguh
  "sebab_status": "Gagal subjek Matematik",
  "nama_pa": "Pn. Siti Aminah",
  "status_takaful": "belum_bayar", -- bayar | belum_bayar | pengecualian
  "tarikh_bayaran": null,
  "amaun_bayaran": null,
  "resit_nama_fail": null,      -- nama fail resit yang diupload
  "resit_data": null,           -- kandungan fail dalam base64
  "resit_disahkan": false,
  "tarikh_disahkan": null,
  "catatan": ""
}
```

**Relevant Context:**
- localStorage menyokong sehingga ~5MB — cukup untuk 500 pelajar tanpa resit
- Resit disimpan sebagai base64 dalam JSON — had saiz setiap resit perlu dihadkan (~500KB)
- `kelas_asal` dan `semester_asal` diisi HANYA untuk pelajar berstatus repeat/extend/junior

**Status:** [ ] pending

---

### Sub-Tugas 3: Modul Senarai & Profil Pelajar

**Intent:**  
Bina paparan utama senarai semua pelajar dengan fungsi carian, penapis pelbagai kriteria, dan paparan profil individu pelajar yang lengkap.

**Expected Outcomes:**
- Jadual senarai pelajar dengan lajur: No. Matrik, Nama, Kelas Semasa, Status Pengajian, Status Takaful, PA
- Pelajar berstatus repeat/extend/junior menunjukkan kelas asal dalam kurungan, contoh: `DKM2A (sepatutnya DKM3B)`
- Carian berfungsi untuk nama, no. matrik, dan nama PA
- Penapis berfungsi untuk status pengajian dan status takaful
- Klik pada nama pelajar membuka panel profil lengkap
- Profil lengkap menunjukkan semua maklumat termasuk butang kemaskini

**Todo List:**
- [ ] Bina `js/studentList.js` — fungsi render jadual pelajar
- [ ] Laksanakan logik paparan kelas: jika `kelas_semasa !== kelas_asal`, papar `"kelas_semasa (sepatutnya kelas_asal)"`
- [ ] Bina bar carian dengan carian masa nyata (real-time search)
- [ ] Bina dropdown penapis: Status Pengajian, Status Takaful, Program, PA
- [ ] Bina panel modal profil pelajar lengkap
- [ ] Tambah lencana (badge) warna untuk setiap status: Aktif=hijau, Repeat=oren, Extend=biru, Junior=ungu, Tangguh=kelabu
- [ ] Bina butang "Tambah Pelajar Baru" yang membuka borang tambah
- [ ] Bina borang tambah/edit pelajar

**Relevant Context:**
- Logik paparan kelas semasa/asal bergantung pada perbandingan dua field dalam rekod JSON
- Warna lencana mestilah konsisten dengan CSS yang ditetapkan dalam Sub-Tugas 1

**Status:** [ ] pending

---

### Sub-Tugas 4: Modul Pembayaran Takaful & Upload Resit

**Intent:**  
Bina sistem pengurusan pembayaran takaful yang membenarkan pegawai merekod bayaran, menerima upload resit (imej atau PDF), menyemak dan mengesahkan resit, serta melihat semua resit yang telah diupload.

**Expected Outcomes:**
- Pegawai boleh tandakan pelajar sebagai "Sudah Bayar" dengan memasukkan tarikh dan amaun
- Pegawai boleh upload fail resit (JPG/PNG/PDF, had 500KB) untuk setiap pelajar
- Resit yang diupload boleh dipapar/preview terus dalam dashboard
- Resit yang belum disahkan menunjukkan status "Menunggu Pengesahan"
- Butang "Sahkan Bayaran" mengubah status takaful kepada "Bayar" dan rekod tarikh pengesahan

**Todo List:**
- [ ] Bina `js/payment.js` — fungsi rekod bayaran, kemaskini status takaful
- [ ] Bina borang rekod bayaran: tarikh bayar, amaun, ruang upload resit
- [ ] Laksanakan fungsi upload resit: baca fail sebagai base64, semak saiz fail (had 500KB), simpan dalam rekod JSON pelajar
- [ ] Bina fungsi preview resit: papar imej atau buka PDF dalam tab baru
- [ ] Bina aliran pengesahan: status "menunggu" → pegawai klik "Sahkan" → status tukar "bayar"
- [ ] Bina paparan senarai semua pelajar dengan resit menunggu pengesahan
- [ ] Laksanakan fungsi import CSV bayaran — pegawai boleh import senarai bayaran dari Excel/sistem kewangan

**Relevant Context:**
- Resit disimpan sebagai base64 dalam localStorage — ini mengelakkan keperluan pelayan
- Had 500KB per resit adalah bersesuaian dengan saiz foto resit biasa dari telefon
- Import CSV memerlukan format lajur yang ditetapkan: No_Matrik, Tarikh_Bayar, Amaun

**Status:** [ ] pending

---

### Sub-Tugas 5: Modul Pelajar Berisiko / Tercicir

**Intent:**  
Bina halaman khas yang mengumpulkan semua pelajar yang memerlukan perhatian pegawai — pelajar belum bayar takaful, pelajar repeat, extend, junior, dan tangguh — dalam satu paparan terpusat.

**Expected Outcomes:**
- Halaman "Pelajar Perlu Perhatian" dengan bahagian tersusun mengikut kategori
- Setiap kategori menunjukkan bilangan pelajar yang terlibat
- Pegawai boleh klik terus ke profil pelajar dari halaman ini
- Senarai "Belum Bayar" boleh dieksport sebagai CSV untuk tindakan susulan

**Todo List:**
- [ ] Bina `js/atRisk.js` — fungsi tapis dan kumpul pelajar mengikut kategori risiko
- [ ] Bina halaman "Pelajar Perlu Perhatian" dengan 5 seksyen:
  - Belum Bayar Takaful
  - Pelajar Repeat
  - Pelajar Extend
  - Pelajar Masuk Kelas Junior
  - Pelajar Tangguh
- [ ] Tambah pembilang (counter) pada setiap seksyen
- [ ] Bina fungsi eksport senarai "Belum Bayar" sebagai CSV
- [ ] Tambah ruang catatan ringkas pada setiap pelajar dalam senarai ini

**Relevant Context:**
- Data ditapis dari localStorage menggunakan field `status_pengajian` dan `status_takaful`
- Halaman ini adalah paparan baca sahaja — kemaskini dilakukan melalui modul Senarai Pelajar

**Status:** [ ] pending

---

### Sub-Tugas 6: Modul Pengurusan Semester

**Intent:**  
Bina fungsi "Mulakan Semester Baru" yang secara automatik menaikkan semester dan kelas semua pelajar berstatus Aktif, manakala pelajar berstatus lain kekal tidak berubah, memerlukan semakan manual oleh pegawai.

**Expected Outcomes:**
- Butang "Mulakan Semester Baru" membuka wizard 3 langkah
- Semua pelajar Aktif dinaikkan semester dan kelas secara automatik
- Pelajar Repeat/Extend/Junior/Tangguh TIDAK diubah oleh proses automatik
- Field `kelas_asal` dan `semester_asal` untuk pelajar yang tercicir dikemaskini mengikut semester baru
- Selepas proses, status takaful SEMUA pelajar di-reset kepada "belum_bayar"
- Log perubahan semester disimpan untuk rujukan

**Todo List:**
- [ ] Bina `js/semesterManager.js` — logik naik semester
- [ ] Bina wizard "Mulakan Semester Baru" (3 langkah):
  - Langkah 1: Masukkan nama semester baru (cth: Sem 5 2025/2026)
  - Langkah 2: Semak senarai pelajar yang akan dinaikkan automatik vs perlu semak manual
  - Langkah 3: Pengesahan dan proses
- [ ] Laksanakan logik naik kelas automatik: parse nama kelas (cth: DKM2A → DKM3A)
- [ ] Laksanakan logik kemaskini `kelas_asal` dan `semester_asal` untuk pelajar tercicir
- [ ] Laksanakan reset status takaful ke "belum_bayar" selepas semester baru dimulakan
- [ ] Simpan log perubahan semester dalam localStorage
- [ ] Tambah amaran (warning) jika pelajar repeat/extend/junior perlu disemak selepas proses

**Relevant Context:**
- Logik naik kelas: gantikan nombor semester dalam nama kelas, cth DKM2A → DKM3A (tambah 1)
- Perlu tangani kes khas: semester terakhir (Sem 6), pelajar yang sudah tamat
- Log disimpan sebagai array dalam localStorage dengan timestamp

**Status:** [ ] pending

---

### Sub-Tugas 7: Dashboard Ringkasan & Laporan

**Intent:**  
Bina halaman utama dashboard dengan kad statistik ringkasan dan carta visual yang memberi gambaran pantas tentang status keseluruhan pengurusan takaful pelajar.

**Expected Outcomes:**
- Halaman utama (home) menunjukkan kad statistik utama
- Carta pai atau bar menunjukkan pecahan status takaful dan status pengajian
- Senarai 5 pelajar terkini yang perlu perhatian
- Maklumat semester semasa dipaparkan dengan jelas

**Todo List:**
- [ ] Bina `js/dashboard.js` — fungsi kira statistik dari data JSON
- [ ] Bina 6 kad statistik: Jumlah Pelajar, Sudah Bayar, Belum Bayar, Repeat, Extend, Tangguh
- [ ] Laksanakan carta menggunakan Chart.js (CDN) — carta pai status takaful + carta bar status pengajian
- [ ] Bina seksyen "Perlu Perhatian Segera" — 5 pelajar teratas yang belum bayar
- [ ] Papar nama semester semasa dan bilangan hari sejak semester dimulakan
- [ ] Bina butang "Jana Laporan PDF" menggunakan fungsi cetak browser (window.print)

**Relevant Context:**
- Guna Chart.js dari CDN untuk mengelakkan keperluan install npm
- Laporan PDF menggunakan CSS @media print — lebih mudah dari library PDF tambahan

**Status:** [ ] pending

---

### Sub-Tugas 8: Pengujian Akhir & Fail Panduan Pengguna

**Intent:**  
Lakukan ujian menyeluruh semua fungsi dengan data contoh lengkap, dan sediakan fail panduan ringkas dalam Bahasa Melayu untuk membantu pegawai menggunakan sistem.

**Expected Outcomes:**
- Semua fungsi berjalan tanpa ralat di browser Chrome/Edge terkini
- Fail `data/contoh-pelajar.json` mengandungi 20 rekod realistik merangkumi semua status
- Fail `PANDUAN.md` atau `panduan.html` tersedia dalam folder projek
- Pegawai boleh guna sistem tanpa bantuan teknikal selepas baca panduan

**Todo List:**
- [ ] Cipta 20 rekod contoh realistik dalam `data/contoh-pelajar.json` merangkumi: aktif, repeat, extend, junior, tangguh, sudah bayar, belum bayar, dengan dan tanpa resit
- [ ] Uji semua fungsi: tambah, edit, padam pelajar
- [ ] Uji fungsi upload resit dan pengesahan
- [ ] Uji fungsi Mulakan Semester Baru
- [ ] Uji import dan eksport JSON/CSV
- [ ] Uji fungsi carian dan penapis
- [ ] Bina `panduan.html` — panduan pengguna dalam Bahasa Melayu dengan tangkapan skrin atau arahan berperingkat
- [ ] Tambah nota penting dalam panduan: cara backup data, cara restore data

**Relevant Context:**
- Ujian dilakukan secara manual di browser kerana ini bukan projek Node.js
- Panduan perlu merangkumi: cara buka sistem, cara tambah pelajar, cara rekod bayaran, cara mulakan semester baru, cara backup

**Status:** [ ] pending

---

## Senarai Fail Akhir Projek

```
takaful-dashboard/
├── index.html                  -- Halaman utama / dashboard ringkasan
├── pelajar.html                -- Senarai & profil pelajar
├── pembayaran.html             -- Modul pembayaran & resit
├── perhatian.html              -- Pelajar berisiko / tercicir
├── semester.html               -- Pengurusan semester
├── panduan.html                -- Panduan pengguna
├── css/
│   ├── style.css               -- Gaya utama
│   └── print.css               -- Gaya cetak untuk laporan PDF
├── js/
│   ├── app.js                  -- Inisialisasi dan navigasi
│   ├── dataManager.js          -- Pengurusan data JSON & localStorage
│   ├── studentList.js          -- Paparan senarai & profil pelajar
│   ├── payment.js              -- Modul pembayaran & resit
│   ├── atRisk.js               -- Modul pelajar perlu perhatian
│   ├── semesterManager.js      -- Pengurusan semester
│   └── dashboard.js            -- Statistik & carta
└── data/
    └── contoh-pelajar.json     -- Data contoh untuk demo
```

---

## Urutan Pembinaan yang Disyorkan

Sub-Tugas 1 → Sub-Tugas 2 → Sub-Tugas 3 → Sub-Tugas 4 → Sub-Tugas 5 → Sub-Tugas 6 → Sub-Tugas 7 → Sub-Tugas 8

Setiap sub-tugas bergantung kepada yang sebelumnya, terutamanya Sub-Tugas 2 (struktur data) yang menjadi asas kepada semua modul lain.
