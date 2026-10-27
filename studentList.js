/* ============================================================
   studentList.js — Senarai Pelajar, Profil, Tambah/Edit
   ============================================================ */

let penapis_semasa = { carian: '', pengajian: '', takaful: '', program: '', pa: '' };
let mod_borang = 'tambah'; // 'tambah' | 'edit'
let id_edit_semasa = null;

// ---------- Render Jadual ----------

function render_senarai_pelajar() {
  let senarai = semua_pelajar();

  // Tapis
  if (penapis_semasa.carian) {
    const q = penapis_semasa.carian.toLowerCase();
    senarai = senarai.filter(p =>
      p.nama.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.nama_pa || '').toLowerCase().includes(q)
    );
  }
  if (penapis_semasa.pengajian) senarai = senarai.filter(p => p.status_pengajian === penapis_semasa.pengajian);
  if (penapis_semasa.takaful)   senarai = senarai.filter(p => p.status_takaful   === penapis_semasa.takaful);
  if (penapis_semasa.program)   senarai = senarai.filter(p => (p.program||'').toLowerCase() === penapis_semasa.program.toLowerCase());
  if (penapis_semasa.pa)        senarai = senarai.filter(p => (p.nama_pa||'').toLowerCase().includes(penapis_semasa.pa.toLowerCase()));

  const el = document.getElementById('jadual-pelajar-badan');
  if (!el) return;

  // Kemaskini lencana bilangan
  document.getElementById('bil-dipapar').textContent = senarai.length;
  document.getElementById('bil-jumlah').textContent  = semua_pelajar().length;

  if (senarai.length === 0) {
    el.innerHTML = `<tr><td colspan="7"><div class="tiada-data"><div class="tiada-data-ikon">🔍</div><p>Tiada pelajar ditemui.</p></div></td></tr>`;
    return;
  }

  el.innerHTML = senarai.map(p => `
    <tr>
      <td><strong>${p.id}</strong></td>
      <td><span class="pautan-pelajar" onclick="buka_profil('${p.id}')">${p.nama}</span></td>
      <td>${p.program || '—'}</td>
      <td>${kelas_paparan(p)}</td>
      <td>${lencana_pengajian(p.status_pengajian)}</td>
      <td>${lencana_takaful(p.status_takaful)}</td>
      <td>${p.nama_pa || '—'}</td>
      <td>
        <button class="btn btn-biasa btn-kecil" onclick="buka_edit_pelajar('${p.id}')">✏️ Edit</button>
        <button class="btn btn-bahaya btn-kecil" onclick="sahkan_padam('${p.id}','${p.nama.replace(/'/g,"\\'")}')">🗑</button>
      </td>
    </tr>`).join('');
}

// ---------- Profil Pelajar (Modal) ----------

function buka_profil(id) {
  const p = cari_pelajar(id);
  if (!p) return;

  const resit_html = p.resit_data
    ? `<div style="margin-top:8px">
        <button class="btn btn-biasa btn-kecil" onclick="preview_resit('${id}')">👁 Lihat Resit</button>
        ${!p.resit_disahkan ? `<button class="btn btn-berjaya btn-kecil" onclick="sahkan_resit('${id}')">✅ Sahkan</button>` : ''}
       </div>`
    : `<span style="color:var(--kelabu)">Tiada resit diupload</span>`;

  const kelas_html = (p.kelas_asal && p.kelas_semasa !== p.kelas_asal)
    ? `${p.kelas_semasa} <span class="kelas-asal">(sepatutnya ${p.kelas_asal})</span>`
    : (p.kelas_semasa || '—');

  const sem_html = (p.semester_asal && p.semester_semasa !== p.semester_asal)
    ? `${p.semester_semasa} <span class="kelas-asal">(sepatutnya ${p.semester_asal})</span>`
    : (p.semester_semasa || '—');

  const badan = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 24px">
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">NO. MATRIK</label><p>${p.id}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">NO. IC</label><p>${p.no_ic || '—'}</p></div>
      <div style="grid-column:1/-1"><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">NAMA PENUH</label><p style="font-weight:600;font-size:15px">${p.nama}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">PROGRAM</label><p>${p.program || '—'}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">SEMESTER MASUK</label><p>${p.semester_masuk || '—'}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">KELAS SEMASA</label><p>${kelas_html}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">SEMESTER SEMASA</label><p>${sem_html}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">STATUS PENGAJIAN</label><p>${lencana_pengajian(p.status_pengajian)}</p></div>
      <div><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">PENASIHAT AKADEMIK</label><p>${p.nama_pa || '—'}</p></div>
      ${p.sebab_status ? `<div style="grid-column:1/-1"><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">SEBAB STATUS</label><p style="color:var(--oren)">${p.sebab_status}</p></div>` : ''}
      <div style="grid-column:1/-1;border-top:1px solid var(--sempadan);padding-top:14px;margin-top:4px">
        <label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">STATUS TAKAFUL</label>
        <p>${lencana_takaful(p.status_takaful)}</p>
        ${p.tarikh_bayaran ? `<p style="font-size:12px;color:var(--kelabu-gelap);margin-top:4px">Tarikh: ${format_tarikh(p.tarikh_bayaran)} &nbsp;|&nbsp; Amaun: ${format_matawang(p.amaun_bayaran)}</p>` : ''}
        ${p.tarikh_disahkan ? `<p style="font-size:12px;color:var(--hijau)">Disahkan: ${format_tarikh(p.tarikh_disahkan)}</p>` : ''}
      </div>
      <div style="grid-column:1/-1">
        <label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">RESIT BAYARAN</label>
        ${resit_html}
      </div>
      ${p.catatan ? `<div style="grid-column:1/-1"><label style="font-size:11px;color:var(--kelabu-gelap);font-weight:600">CATATAN</label><p style="font-style:italic">${p.catatan}</p></div>` : ''}
    </div>`;

  tunjuk_modal('modal-profil', `Profil Pelajar`, badan, [
    `<button class="btn btn-utama" onclick="tutup_modal('modal-profil');buka_edit_pelajar('${id}')">✏️ Edit</button>`,
    `<button class="btn btn-amaran" onclick="tutup_modal('modal-profil');buka_bayaran_pelajar('${id}')">💳 Rekod Bayaran</button>`,
    `<button class="btn btn-biasa" onclick="tutup_modal('modal-profil')">Tutup</button>`
  ]);
}

// ---------- Borang Tambah / Edit ----------

function buka_tambah_pelajar() {
  mod_borang = 'tambah';
  id_edit_semasa = null;
  isi_borang_pelajar({});
  tunjuk_modal('modal-borang-pelajar', 'Tambah Pelajar Baru');
}

function buka_edit_pelajar(id) {
  const p = cari_pelajar(id);
  if (!p) return;
  mod_borang = 'edit';
  id_edit_semasa = id;
  isi_borang_pelajar(p);
  tunjuk_modal('modal-borang-pelajar', 'Kemaskini Maklumat Pelajar');
}

function isi_borang_pelajar(p) {
  const val = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
  val('f-id', p.id); val('f-nama', p.nama); val('f-no-ic', p.no_ic);
  val('f-program', p.program); val('f-sem-masuk', p.semester_masuk);
  val('f-kelas-semasa', p.kelas_semasa); val('f-kelas-asal', p.kelas_asal);
  val('f-sem-semasa', p.semester_semasa); val('f-sem-asal', p.semester_asal);
  val('f-status-pengajian', p.status_pengajian || 'aktif');
  val('f-sebab-status', p.sebab_status);
  val('f-nama-pa', p.nama_pa);
  val('f-status-takaful', p.status_takaful || 'belum_bayar');
  val('f-catatan', p.catatan);

  // Tunjuk/sembunyi medan kelas asal
  togol_medan_tercicir();

  // Kunci no. matrik jika edit
  const el_id = document.getElementById('f-id');
  if (el_id) el_id.disabled = (mod_borang === 'edit');
}

function togol_medan_tercicir() {
  const status = document.getElementById('f-status-pengajian')?.value;
  const perlu = ['repeat','extend','junior'].includes(status);
  const el = document.getElementById('bahagian-kelas-asal');
  if (el) el.style.display = perlu ? 'grid' : 'none';
}

function simpan_borang_pelajar() {
  const val = id => document.getElementById(id)?.value?.trim() || '';
  const rekod = {
    id: val('f-id').toUpperCase(),
    nama: val('f-nama'),
    no_ic: val('f-no-ic'),
    program: val('f-program').toUpperCase(),
    semester_masuk: val('f-sem-masuk'),
    kelas_semasa: val('f-kelas-semasa').toUpperCase(),
    kelas_asal: val('f-kelas-asal').toUpperCase() || null,
    semester_semasa: val('f-sem-semasa'),
    semester_asal: val('f-sem-asal') || null,
    status_pengajian: val('f-status-pengajian'),
    sebab_status: val('f-sebab-status'),
    nama_pa: val('f-nama-pa'),
    status_takaful: val('f-status-takaful'),
    catatan: val('f-catatan'),
  };

  if (!rekod.id || !rekod.nama) { tunjuk_notif('Sila isi No. Matrik dan Nama Pelajar!', 'merah'); return; }

  if (mod_borang === 'tambah') {
    const ok = tambah_pelajar(rekod);
    if (ok) { tutup_modal('modal-borang-pelajar'); tunjuk_notif('Pelajar berjaya ditambah!', 'hijau'); app.refresh(); }
  } else {
    kemaskini_pelajar(id_edit_semasa, rekod);
    tambah_log('KEMASKINI', `Maklumat ${rekod.nama} (${id_edit_semasa}) dikemaskini.`);
    tutup_modal('modal-borang-pelajar');
    tunjuk_notif('Maklumat pelajar dikemaskini!', 'hijau');
    app.refresh();
  }
}

// ---------- Padam ----------

function sahkan_padam(id, nama) {
  if (!confirm(`Adakah anda pasti mahu memadam rekod ${nama} (${id})?\n\nTindakan ini tidak boleh dibatalkan.`)) return;
  padam_pelajar(id);
  tunjuk_notif(`Rekod ${nama} telah dipadam.`, 'oren');
  app.refresh();
}

// ---------- Inisialisasi Halaman Pelajar ----------

function init_halaman_pelajar() {
  // Carian
  const inp = document.getElementById('carian-pelajar');
  if (inp) inp.addEventListener('input', e => {
    penapis_semasa.carian = e.target.value;
    render_senarai_pelajar();
  });

  // Penapis dropdown
  ['penapis-pengajian','penapis-takaful','penapis-program'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', e => {
      const kunci = id.replace('penapis-', '');
      penapis_semasa[kunci] = e.target.value;
      render_senarai_pelajar();
    });
  });

  // Togol kelas asal
  const el_status = document.getElementById('f-status-pengajian');
  if (el_status) el_status.addEventListener('change', togol_medan_tercicir);

  render_senarai_pelajar();
}
