/* ============================================================
   dataManager.js — Pengurusan Data Pelajar (localStorage)
   ============================================================ */

const KUNCI_DATA   = 'takaful_pelajar';
const KUNCI_SEMESTER = 'takaful_semester';
const KUNCI_LOG    = 'takaful_log';

// ---------- CRUD Asas ----------

function semua_pelajar() {
  const raw = localStorage.getItem(KUNCI_DATA);
  return raw ? JSON.parse(raw) : [];
}

function simpan_semua(senarai) {
  localStorage.setItem(KUNCI_DATA, JSON.stringify(senarai));
}

function cari_pelajar(id) {
  return semua_pelajar().find(p => p.id === id) || null;
}

function tambah_pelajar(rekod) {
  const senarai = semua_pelajar();
  if (senarai.find(p => p.id === rekod.id)) {
    tunjuk_notif('No. Matrik sudah wujud dalam sistem!', 'merah');
    return false;
  }
  rekod.tarikh_daftar = new Date().toISOString();
  senarai.push(rekod);
  simpan_semua(senarai);
  tambah_log('TAMBAH', `Pelajar ${rekod.nama} (${rekod.id}) ditambah.`);
  return true;
}

function kemaskini_pelajar(id, data_baru) {
  const senarai = semua_pelajar();
  const idx = senarai.findIndex(p => p.id === id);
  if (idx === -1) return false;
  senarai[idx] = { ...senarai[idx], ...data_baru };
  simpan_semua(senarai);
  return true;
}

function padam_pelajar(id) {
  const senarai = semua_pelajar().filter(p => p.id !== id);
  simpan_semua(senarai);
  tambah_log('PADAM', `Pelajar ${id} dipadam dari sistem.`);
}

// ---------- Semester ----------

function dapatkan_semester() {
  const raw = localStorage.getItem(KUNCI_SEMESTER);
  return raw ? JSON.parse(raw) : { nama: 'Sem 1 2025/2026', tarikh_mula: new Date().toISOString() };
}

function simpan_semester(data) {
  localStorage.setItem(KUNCI_SEMESTER, JSON.stringify(data));
}

// ---------- Log ----------

function semua_log() {
  const raw = localStorage.getItem(KUNCI_LOG);
  return raw ? JSON.parse(raw) : [];
}

function tambah_log(jenis, mesej) {
  const log = semua_log();
  log.unshift({ jenis, mesej, masa: new Date().toISOString() });
  if (log.length > 200) log.splice(200);
  localStorage.setItem(KUNCI_LOG, JSON.stringify(log));
}

// ---------- Import / Eksport ----------

function eksport_json() {
  const data = { pelajar: semua_pelajar(), semester: dapatkan_semester(), eksport_masa: new Date().toISOString() };
  muat_turun(JSON.stringify(data, null, 2), `takaful-backup-${tarikh_fail()}.json`, 'application/json');
}

function import_json(fail, callback) {
  const pembaca = new FileReader();
  pembaca.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.pelajar || !Array.isArray(data.pelajar)) throw new Error('Format tidak sah');
      simpan_semua(data.pelajar);
      if (data.semester) simpan_semester(data.semester);
      tambah_log('IMPORT', `Import JSON berjaya — ${data.pelajar.length} rekod.`);
      callback(true, data.pelajar.length);
    } catch (err) {
      callback(false, 0);
    }
  };
  pembaca.readAsText(fail);
}

function eksport_csv() {
  const senarai = semua_pelajar();
  const lajur = ['id','nama','no_ic','program','semester_masuk','kelas_semasa','kelas_asal',
                  'semester_semasa','semester_asal','status_pengajian','sebab_status','nama_pa',
                  'status_takaful','tarikh_bayaran','amaun_bayaran','resit_disahkan','tarikh_disahkan','catatan'];
  const baris = [lajur.join(',')];
  senarai.forEach(p => {
    const baris_data = lajur.map(k => {
      const val = p[k] === null || p[k] === undefined ? '' : String(p[k]);
      return `"${val.replace(/"/g, '""')}"`;
    });
    baris.push(baris_data.join(','));
  });
  muat_turun('\uFEFF' + baris.join('\r\n'), `takaful-${tarikh_fail()}.csv`, 'text/csv;charset=utf-8');
}

function import_csv_bayaran(fail, callback) {
  const pembaca = new FileReader();
  pembaca.onload = e => {
    const baris = e.target.result.split('\n').map(b => b.trim()).filter(Boolean);
    let dikemas = 0, gagal = 0;
    for (let i = 1; i < baris.length; i++) {
      const cols = baris[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
      const [no_matrik, tarikh, amaun] = cols;
      if (!no_matrik) continue;
      const ok = kemaskini_pelajar(no_matrik, {
        status_takaful: 'tunggu',
        tarikh_bayaran: tarikh || null,
        amaun_bayaran: amaun || null,
        resit_disahkan: false
      });
      ok ? dikemas++ : gagal++;
    }
    tambah_log('IMPORT_CSV', `Import CSV bayaran: ${dikemas} berjaya, ${gagal} gagal.`);
    callback(dikemas, gagal);
  };
  pembaca.readAsText(fail);
}

// ---------- Utiliti ----------

function muat_turun(kandungan, nama_fail, jenis) {
  const blob = new Blob([kandungan], { type: jenis });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = nama_fail; a.click();
  URL.revokeObjectURL(url);
}

function tarikh_fail() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function format_tarikh(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ms-MY', { day:'2-digit', month:'short', year:'numeric' });
}

function format_matawang(amaun) {
  if (!amaun && amaun !== 0) return '—';
  return 'RM ' + Number(amaun).toFixed(2);
}

function kelas_paparan(p) {
  if (!p.kelas_asal || p.kelas_semasa === p.kelas_asal) return p.kelas_semasa || '—';
  return `${p.kelas_semasa} <span class="kelas-asal">(sepatutnya ${p.kelas_asal})</span>`;
}

function lencana_pengajian(status) {
  const peta = {
    aktif:   ['lencana-aktif',   '✓ Aktif'],
    repeat:  ['lencana-repeat',  '⚠ Repeat'],
    extend:  ['lencana-extend',  '↗ Extend'],
    junior:  ['lencana-junior',  '↓ Junior'],
    tangguh: ['lencana-tangguh', '⏸ Tangguh'],
  };
  const [kelas, teks] = peta[status] || ['lencana-aktif', status];
  return `<span class="lencana ${kelas}">${teks}</span>`;
}

function lencana_takaful(status) {
  const peta = {
    bayar:        ['lencana-bayar',   '✓ Sudah Bayar'],
    belum_bayar:  ['lencana-belum',   '✗ Belum Bayar'],
    tunggu:       ['lencana-tunggu',  '⏳ Menunggu Sahkan'],
    pengecualian: ['lencana-kecuali', '○ Pengecualian'],
  };
  const [kelas, teks] = peta[status] || ['lencana-belum', status];
  return `<span class="lencana ${kelas}">${teks}</span>`;
}

// ---------- Muat data contoh jika kosong ----------

function muat_data_contoh_jika_kosong() {
  if (semua_pelajar().length === 0) {
    fetch('data/contoh-pelajar.json')
      .then(r => r.json())
      .then(data => {
        simpan_semua(data);
        tambah_log('SISTEM', 'Data contoh dimuat ke dalam sistem.');
        if (window.app && typeof window.app.refresh === 'function') window.app.refresh();
      })
      .catch(() => {});
  }
}
