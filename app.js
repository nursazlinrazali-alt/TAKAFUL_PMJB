/* ============================================================
   app.js — Inisialisasi, Navigasi, Utiliti UI
   ============================================================ */

// ---------- Navigasi Halaman ----------

const HALAMAN = ['dashboard','pelajar','pembayaran','perhatian','semester'];

function navigasi(id) {
  // Tukar halaman aktif
  document.querySelectorAll('.halaman').forEach(el => el.classList.remove('aktif'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('aktif'));

  const el_halaman = document.getElementById('halaman-' + id);
  if (el_halaman) el_halaman.classList.add('aktif');

  const el_nav = document.querySelector(`.nav-item[data-halaman="${id}"]`);
  if (el_nav) el_nav.classList.add('aktif');

  // Render kandungan halaman
  switch (id) {
    case 'dashboard':   render_dashboard();           break;
    case 'pelajar':     init_halaman_pelajar();       break;
    case 'pembayaran':  render_halaman_pembayaran();  break;
    case 'perhatian':   render_halaman_perhatian();   break;
    case 'semester':    render_halaman_semester();    break;
  }

  // Kemaskini lencana notifikasi sidebar
  kemaskini_lencana_sidebar();
}

function kemaskini_lencana_sidebar() {
  const senarai = semua_pelajar();
  const bil_perhatian = senarai.filter(p =>
    p.status_takaful === 'belum_bayar' ||
    ['repeat','extend','junior'].includes(p.status_pengajian)
  ).length;
  const bil_tunggu = senarai.filter(p => p.status_takaful === 'tunggu').length;

  const el_p = document.getElementById('lencana-perhatian');
  const el_t = document.getElementById('lencana-tunggu');
  if (el_p) { el_p.textContent = bil_perhatian; el_p.style.display = bil_perhatian ? 'inline' : 'none'; }
  if (el_t) { el_t.textContent = bil_tunggu;    el_t.style.display = bil_tunggu    ? 'inline' : 'none'; }
}

// ---------- Utiliti UI ----------

function set_teks(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function tunjuk_notif(mesej, jenis = 'hijau') {
  let el = document.getElementById('notifikasi-global');
  if (!el) {
    el = document.createElement('div');
    el.id = 'notifikasi-global';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;max-width:360px;font-size:13px;font-weight:500;border-radius:8px;padding:12px 18px;box-shadow:0 4px 16px rgba(0,0,0,0.15);transition:opacity 0.3s';
    document.body.appendChild(el);
  }
  const warna = { hijau:'#27ae60', merah:'#e74c3c', oren:'#e67e22', biru:'#2980b9' };
  el.style.background = warna[jenis] || warna.hijau;
  el.style.color = '#fff';
  el.style.opacity = '1';
  el.textContent = mesej;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 3500);
}

function tunjuk_modal(id, tajuk, badan_html, butang_arr) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.className = 'modal-latar';
    el.innerHTML = `
      <div class="modal-kotak">
        <div class="modal-kepala">
          <h3 class="modal-tajuk-teks"></h3>
          <button class="modal-tutup" onclick="tutup_modal('${id}')">✕</button>
        </div>
        <div class="modal-badan"></div>
        <div class="modal-kaki"></div>
      </div>`;
    document.body.appendChild(el);
    // Tutup jika klik latar
    el.addEventListener('click', e => { if (e.target === el) tutup_modal(id); });
  }
  el.querySelector('.modal-tajuk-teks').textContent = tajuk;
  el.querySelector('.modal-badan').innerHTML = badan_html;
  el.querySelector('.modal-kaki').innerHTML = (butang_arr || []).join('');
  el.classList.add('buka');
  document.body.style.overflow = 'hidden';
}

function tutup_modal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('buka');
  document.body.style.overflow = '';
}

// ---------- Refresh global ----------

window.app = {
  refresh() {
    const id_aktif = document.querySelector('.nav-item.aktif')?.dataset.halaman || 'dashboard';
    navigasi(id_aktif);
  }
};

// ---------- Import / Eksport dari toolbar ----------

function buka_import_json() {
  document.getElementById('inp-import-json')?.click();
}

function proses_import_json(inp) {
  const fail = inp.files[0];
  if (!fail) return;
  import_json(fail, (ok, bil) => {
    if (ok) {
      tunjuk_notif(`Import berjaya! ${bil} rekod dimuatkan.`, 'hijau');
      app.refresh();
    } else {
      tunjuk_notif('Import gagal. Sila semak format fail JSON.', 'merah');
    }
    inp.value = '';
  });
}

function buka_import_csv_bayaran() {
  document.getElementById('inp-import-csv')?.click();
}

function proses_import_csv(inp) {
  const fail = inp.files[0];
  if (!fail) return;
  import_csv_bayaran(fail, (dikemas, gagal) => {
    tunjuk_notif(`CSV bayaran diimport: ${dikemas} rekod dikemas, ${gagal} gagal.`, dikemas > 0 ? 'hijau' : 'oren');
    app.refresh();
    inp.value = '';
  });
}

// ---------- Muat ----------

document.addEventListener('DOMContentLoaded', () => {
  muat_data_contoh_jika_kosong();
  navigasi('dashboard');

  // Input tersembunyi untuk import
  ['inp-import-json','inp-import-csv'].forEach(id => {
    if (!document.getElementById(id)) {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.id = id; inp.style.display = 'none';
      if (id === 'inp-import-json') { inp.accept = '.json'; inp.onchange = () => proses_import_json(inp); }
      if (id === 'inp-import-csv')  { inp.accept = '.csv';  inp.onchange = () => proses_import_csv(inp); }
      document.body.appendChild(inp);
    }
  });
});
