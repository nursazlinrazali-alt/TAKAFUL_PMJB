/* ============================================================
   payment.js — Modul Pembayaran Takaful & Upload Resit
   ============================================================ */

let _resit_sementara = { data: null, nama: null };

// ---------- Buka Modal Bayaran ----------

function buka_bayaran_pelajar(id) {
  const p = cari_pelajar(id);
  if (!p) return;

  const badan = `
    <div class="kotak-amaran biru" style="margin-bottom:18px">
      <span class="kotak-amaran-ikon">ℹ️</span>
      <div><strong>${p.nama}</strong> — ${p.id}<br>
      Status semasa: ${lencana_takaful(p.status_takaful)}</div>
    </div>
    <div class="kumpulan-borang">
      <label>Tarikh Bayaran</label>
      <input type="date" id="pay-tarikh" class="kawalan-borang"
        value="${p.tarikh_bayaran ? p.tarikh_bayaran.substring(0,10) : new Date().toISOString().substring(0,10)}">
    </div>
    <div class="kumpulan-borang">
      <label>Amaun Bayaran (RM)</label>
      <input type="number" id="pay-amaun" class="kawalan-borang"
        placeholder="cth: 45.00" step="0.01" min="0" value="${p.amaun_bayaran || ''}">
    </div>
    <div class="kumpulan-borang">
      <label>Upload Resit (JPG / PNG / PDF — had 500KB)</label>
      <div class="zon-upload ${p.resit_data ? 'ada-fail' : ''}" id="zon-upload-resit"
           onclick="document.getElementById('inp-resit').click()">
        <div class="zon-upload-ikon">${p.resit_data ? '✅' : '📎'}</div>
        <p id="zon-upload-teks">${p.resit_nama_fail ? p.resit_nama_fail : 'Klik untuk pilih fail resit'}</p>
        <small>Saiz maksimum: 500KB</small>
      </div>
      <input type="file" id="inp-resit" accept="image/*,.pdf" style="display:none"
             onchange="proses_upload_resit(this,'${id}')">
    </div>`;

  tunjuk_modal('modal-bayaran', `Rekod Bayaran — ${p.nama}`, badan, [
    `<button class="btn btn-berjaya" onclick="simpan_bayaran('${id}','tunggu')">💾 Simpan &amp; Tunggu Sahkan</button>`,
    `<button class="btn btn-utama"   onclick="simpan_bayaran('${id}','bayar')">✅ Terus Sahkan</button>`,
    `<button class="btn btn-biasa"   onclick="tutup_modal('modal-bayaran')">Batal</button>`
  ]);
}

// ---------- Proses Upload ----------

function proses_upload_resit(inp) {
  const fail = inp.files[0];
  if (!fail) return;
  if (fail.size > 500 * 1024) {
    tunjuk_notif('Saiz fail melebihi 500KB. Sila kompres imej terlebih dahulu.', 'merah');
    inp.value = '';
    return;
  }
  const pembaca = new FileReader();
  pembaca.onload = e => {
    _resit_sementara.data = e.target.result;
    _resit_sementara.nama = fail.name;
    const zon  = document.getElementById('zon-upload-resit');
    const teks = document.getElementById('zon-upload-teks');
    if (zon)  zon.classList.add('ada-fail');
    if (teks) teks.textContent = `✅ ${fail.name} (${(fail.size/1024).toFixed(1)} KB)`;
  };
  pembaca.readAsDataURL(fail);
}

// ---------- Simpan Bayaran ----------

function simpan_bayaran(id, status_akhir) {
  const tarikh = document.getElementById('pay-tarikh')?.value;
  const amaun  = document.getElementById('pay-amaun')?.value;
  if (!tarikh) { tunjuk_notif('Sila pilih tarikh bayaran!', 'merah'); return; }

  const kemaskini = {
    status_takaful:  status_akhir,
    tarikh_bayaran:  tarikh,
    amaun_bayaran:   amaun || null,
    resit_disahkan:  status_akhir === 'bayar',
    tarikh_disahkan: status_akhir === 'bayar' ? new Date().toISOString() : null,
  };
  if (_resit_sementara.data) {
    kemaskini.resit_data      = _resit_sementara.data;
    kemaskini.resit_nama_fail = _resit_sementara.nama;
  }
  kemaskini_pelajar(id, kemaskini);
  _resit_sementara = { data: null, nama: null };

  const p    = cari_pelajar(id);
  const msg  = status_akhir === 'bayar'
    ? `Bayaran ${p?.nama} disahkan.`
    : `Bayaran ${p?.nama} disimpan — menunggu pengesahan.`;
  tambah_log('BAYARAN', msg);
  tutup_modal('modal-bayaran');
  tunjuk_notif(msg, status_akhir === 'bayar' ? 'hijau' : 'oren');
  app.refresh();
}

// ---------- Preview Resit ----------

function preview_resit(id) {
  const p = cari_pelajar(id);
  if (!p || !p.resit_data) return;
  if (p.resit_data.startsWith('data:image')) {
    const badan = `<img src="${p.resit_data}" style="max-width:100%;border-radius:6px" alt="Resit">`;
    tunjuk_modal('modal-preview-resit', `Resit — ${p.nama}`, badan, [
      `<button class="btn btn-biasa" onclick="tutup_modal('modal-preview-resit')">Tutup</button>`
    ]);
  } else {
    const w = window.open();
    w.document.write(`<iframe src="${p.resit_data}" width="100%" height="100%" style="border:none;margin:0;padding:0"></iframe>`);
  }
}

// ---------- Sahkan / Tolak Resit ----------

function sahkan_resit(id) {
  const p = cari_pelajar(id);
  if (!p) return;
  kemaskini_pelajar(id, { status_takaful: 'bayar', resit_disahkan: true, tarikh_disahkan: new Date().toISOString() });
  tambah_log('SAHKAN', `Resit ${p.nama} disahkan.`);
  tunjuk_notif(`Resit ${p.nama} berjaya disahkan!`, 'hijau');
  tutup_modal('modal-profil');
  app.refresh();
}

function tolak_resit(id) {
  const p = cari_pelajar(id);
  if (!p) return;
  if (!confirm(`Tolak resit ${p.nama}? Status akan dikembalikan kepada Belum Bayar.`)) return;
  kemaskini_pelajar(id, { status_takaful: 'belum_bayar', resit_data: null, resit_nama_fail: null, resit_disahkan: false, tarikh_bayaran: null, amaun_bayaran: null });
  tambah_log('TOLAK', `Resit ${p.nama} ditolak.`);
  tunjuk_notif(`Resit ${p.nama} ditolak.`, 'oren');
  app.refresh();
}

// ---------- Render Halaman Pembayaran ----------

function render_halaman_pembayaran() {
  const senarai = semua_pelajar();
  const tunggu  = senarai.filter(p => p.status_takaful === 'tunggu');
  const belum   = senarai.filter(p => p.status_takaful === 'belum_bayar');

  // Menunggu pengesahan
  const el_tunggu = document.getElementById('senarai-tunggu-sahkan');
  if (el_tunggu) {
    const el_bil = document.getElementById('bil-tunggu-sahkan');
    if (el_bil) el_bil.textContent = tunggu.length;
    if (tunggu.length === 0) {
      el_tunggu.innerHTML = `<div class="tiada-data"><div class="tiada-data-ikon">✅</div><p>Tiada resit menunggu pengesahan.</p></div>`;
    } else {
      el_tunggu.innerHTML = tunggu.map(p => `
        <div class="item-log">
          <div style="flex:1">
            <strong>${p.nama}</strong> <span style="font-size:12px;color:var(--kelabu-gelap)">${p.id}</span>
            <span style="font-size:12px;display:block">Tarikh: ${format_tarikh(p.tarikh_bayaran)} &nbsp;|&nbsp; Amaun: ${format_matawang(p.amaun_bayaran)}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${p.resit_data ? `<button class="btn btn-biasa btn-kecil" onclick="preview_resit('${p.id}')">👁 Lihat Resit</button>` : ''}
            <button class="btn btn-berjaya btn-kecil" onclick="sahkan_resit('${p.id}')">✅ Sahkan</button>
            <button class="btn btn-bahaya btn-kecil" onclick="tolak_resit('${p.id}')">✗ Tolak</button>
          </div>
        </div>`).join('');
    }
  }

  // Belum bayar
  const el_belum = document.getElementById('senarai-belum-bayar-pay');
  if (el_belum) {
    const el_bil = document.getElementById('bil-belum-bayar-pay');
    if (el_bil) el_bil.textContent = belum.length;
    if (belum.length === 0) {
      el_belum.innerHTML = `<div class="tiada-data"><div class="tiada-data-ikon">🎉</div><p>Semua pelajar telah membuat bayaran!</p></div>`;
    } else {
      el_belum.innerHTML = `
        <div class="jadual-balut"><table class="jadual">
          <thead><tr><th>No. Matrik</th><th>Nama</th><th>Kelas</th><th>PA</th><th>Tindakan</th></tr></thead>
          <tbody>${belum.map(p => `
            <tr>
              <td>${p.id}</td>
              <td><span class="pautan-pelajar" onclick="buka_profil('${p.id}')">${p.nama}</span></td>
              <td>${kelas_paparan(p)}</td>
              <td>${p.nama_pa || '—'}</td>
              <td><button class="btn btn-amaran btn-kecil" onclick="buka_bayaran_pelajar('${p.id}')">💳 Rekod</button></td>
            </tr>`).join('')}
          </tbody>
        </table></div>`;
    }
  }
}

// ---------- Eksport CSV belum bayar ----------

function eksport_belum_bayar_csv() {
  const senarai = semua_pelajar().filter(p => p.status_takaful === 'belum_bayar');
  if (!senarai.length) { tunjuk_notif('Tiada pelajar belum bayar untuk dieksport.', 'oren'); return; }
  const baris = ['No_Matrik,Nama,Program,Kelas_Semasa,Semester,PA'];
  senarai.forEach(p => {
    baris.push(`"${p.id}","${p.nama}","${p.program||''}","${p.kelas_semasa||''}","${p.semester_semasa||''}","${p.nama_pa||''}"`);
  });
  muat_turun('\uFEFF' + baris.join('\r\n'), `belum-bayar-${tarikh_fail()}.csv`, 'text/csv;charset=utf-8');
}
