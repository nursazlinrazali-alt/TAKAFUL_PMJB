/* ============================================================
   semesterManager.js — Pengurusan Semester & Naik Kelas Auto
   ============================================================ */

let wizard_langkah_semasa = 1;
let preview_naik = [];

// ---------- Render Halaman Semester ----------

function render_halaman_semester() {
  const sem = dapatkan_semester();
  set_teks('sem-nama-semasa', sem.nama);
  set_teks('sem-tarikh-mula', format_tarikh(sem.tarikh_mula));

  const log = semua_log().filter(l => ['SEMESTER','SISTEM','IMPORT'].includes(l.jenis));
  const el_log = document.getElementById('log-aktiviti');
  if (el_log) {
    if (log.length === 0) {
      el_log.innerHTML = '<div class="tiada-data"><div class="tiada-data-ikon">📋</div><p>Tiada log aktiviti.</p></div>';
    } else {
      el_log.innerHTML = log.slice(0, 30).map(l => `
        <div class="item-log">
          <div class="log-masa">${format_tarikh(l.masa)}</div>
          <div><strong>[${l.jenis}]</strong> ${l.mesej}</div>
        </div>`).join('');
    }
  }

  // Set nilai input semester baru
  const inp = document.getElementById('inp-nama-semester-baru');
  if (inp && !inp.value) inp.value = cadang_semester_seterusnya(sem.nama);
}

// ---------- Cadang nama semester seterusnya ----------

function cadang_semester_seterusnya(nama_sem) {
  // Format: "Sem X YYYY/YYYY"
  const m = nama_sem.match(/Sem\s*(\d+)\s*(\d{4})\/(\d{4})/i);
  if (!m) return '';
  let sem_no = parseInt(m[1]);
  let tahun1 = parseInt(m[2]);
  let tahun2 = parseInt(m[3]);
  sem_no++;
  if (sem_no > 6) { sem_no = 1; tahun1++; tahun2++; }
  return `Sem ${sem_no} ${tahun1}/${tahun2}`;
}

// ---------- Logik naik kelas auto ----------

function naik_kelas(kelas) {
  // Format nama kelas: DKM2A, DIT3B, dll — tukar angka sahaja
  if (!kelas) return kelas;
  return kelas.replace(/(\d+)/, (_, n) => parseInt(n) + 1);
}

function naik_semester_str(sem_str) {
  if (!sem_str) return sem_str;
  const m = sem_str.match(/Sem\s*(\d+)\s*(.+)/i);
  if (!m) return sem_str;
  return `Sem ${parseInt(m[1]) + 1} ${m[2]}`;
}

// ---------- Wizard Langkah 1: Semak Preview ----------

function wizard_semak_preview() {
  const nama_baru = document.getElementById('inp-nama-semester-baru')?.value?.trim();
  if (!nama_baru) { tunjuk_notif('Sila masukkan nama semester baru!', 'merah'); return; }

  const senarai  = semua_pelajar();
  const aktif    = senarai.filter(p => p.status_pengajian === 'aktif');
  const tercicir = senarai.filter(p => ['repeat','extend','junior','tangguh'].includes(p.status_pengajian));

  preview_naik = aktif;

  // Papar preview
  const el_auto = document.getElementById('preview-naik-auto');
  if (el_auto) {
    el_auto.innerHTML = aktif.length === 0
      ? '<p style="color:var(--kelabu-gelap)">Tiada pelajar aktif.</p>'
      : `<div class="jadual-balut"><table class="jadual">
          <thead><tr><th>No. Matrik</th><th>Nama</th><th>Kelas Lama</th><th>Kelas Baru</th></tr></thead>
          <tbody>${aktif.map(p => `
            <tr>
              <td>${p.id}</td><td>${p.nama}</td>
              <td>${p.kelas_semasa}</td>
              <td style="color:var(--biru-cerah);font-weight:600">${naik_kelas(p.kelas_semasa)}</td>
            </tr>`).join('')}
          </tbody>
        </table></div>`;
  }

  const el_manual = document.getElementById('preview-semak-manual');
  if (el_manual) {
    el_manual.innerHTML = tercicir.length === 0
      ? '<p style="color:var(--hijau)">✓ Tiada pelajar yang memerlukan semakan manual.</p>'
      : `<div class="kotak-amaran kuning"><span class="kotak-amaran-ikon">⚠️</span>
          <div>${tercicir.length} pelajar ini TIDAK akan dinaikkan kelas secara automatik — perlu semakan manual selepas proses:
          <ul style="margin-top:8px;padding-left:20px">${tercicir.map(p =>
            `<li><strong>${p.nama}</strong> (${p.id}) — ${p.status_pengajian}</li>`).join('')}
          </ul></div></div>`;
  }

  set_teks('preview-bil-aktif', aktif.length);
  set_teks('preview-bil-manual', tercicir.length);
  set_teks('preview-nama-semester', nama_baru);

  // Ke langkah 2
  tukar_wizard(2);
}

// ---------- Wizard Langkah 2: Sahkan & Proses ----------

function wizard_proses_semester() {
  const nama_baru = document.getElementById('inp-nama-semester-baru')?.value?.trim();
  if (!nama_baru) return;

  const senarai = semua_pelajar();

  senarai.forEach(p => {
    const kemaskini = { status_takaful: 'belum_bayar', resit_data: null, resit_nama_fail: null, resit_disahkan: false, tarikh_bayaran: null, amaun_bayaran: null, tarikh_disahkan: null };

    if (p.status_pengajian === 'aktif') {
      // Naik kelas dan semester
      kemaskini.kelas_semasa    = naik_kelas(p.kelas_semasa);
      kemaskini.kelas_asal      = naik_kelas(p.kelas_semasa); // reset asal = semasa
      kemaskini.semester_semasa = nama_baru;
      kemaskini.semester_asal   = nama_baru;
    } else {
      // Pelajar tercicir — kelas semasa tidak berubah, tapi kelas_asal dan semester_asal dikemas
      if (p.kelas_asal) kemaskini.kelas_asal = naik_kelas(p.kelas_asal);
      if (p.semester_asal) kemaskini.semester_asal = naik_semester_str(p.semester_asal);
    }

    kemaskini_pelajar(p.id, kemaskini);
  });

  // Simpan semester baru
  simpan_semester({ nama: nama_baru, tarikh_mula: new Date().toISOString() });
  tambah_log('SEMESTER', `Semester baru dimulakan: ${nama_baru}. ${preview_naik.length} pelajar dinaikkan kelas. Status takaful semua pelajar di-reset.`);

  // Ke langkah 3 (selesai)
  tukar_wizard(3);
  set_teks('selesai-nama-semester', nama_baru);
  set_teks('selesai-bil-naik', preview_naik.length);
  app.refresh();
  tunjuk_notif(`Semester baru ${nama_baru} berjaya dimulakan!`, 'hijau');
}

function tukar_wizard(langkah) {
  wizard_langkah_semasa = langkah;
  document.querySelectorAll('.wizard-item').forEach((el, i) => {
    el.classList.toggle('aktif', i + 1 === langkah);
    el.classList.toggle('selesai', i + 1 < langkah);
  });
  document.querySelectorAll('.wizard-panel').forEach((el, i) => {
    el.classList.toggle('aktif', i + 1 === langkah);
  });
}

function wizard_semula() {
  tukar_wizard(1);
  preview_naik = [];
}
