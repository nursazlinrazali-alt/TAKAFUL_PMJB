/* ============================================================
   atRisk.js — Modul Pelajar Berisiko / Tercicir
   ============================================================ */

function render_halaman_perhatian() {
  const senarai = semua_pelajar();
  const kumpulan = {
    belum_bayar: senarai.filter(p => p.status_takaful === 'belum_bayar'),
    repeat:      senarai.filter(p => p.status_pengajian === 'repeat'),
    extend:      senarai.filter(p => p.status_pengajian === 'extend'),
    junior:      senarai.filter(p => p.status_pengajian === 'junior'),
    tangguh:     senarai.filter(p => p.status_pengajian === 'tangguh'),
  };

  set_teks('bil-perhatian-belum',   kumpulan.belum_bayar.length);
  set_teks('bil-perhatian-repeat',  kumpulan.repeat.length);
  set_teks('bil-perhatian-extend',  kumpulan.extend.length);
  set_teks('bil-perhatian-junior',  kumpulan.junior.length);
  set_teks('bil-perhatian-tangguh', kumpulan.tangguh.length);

  render_seksyen_risiko('perhatian-belum',   kumpulan.belum_bayar, 'bayar');
  render_seksyen_risiko('perhatian-repeat',  kumpulan.repeat,  'pengajian');
  render_seksyen_risiko('perhatian-extend',  kumpulan.extend,  'pengajian');
  render_seksyen_risiko('perhatian-junior',  kumpulan.junior,  'pengajian');
  render_seksyen_risiko('perhatian-tangguh', kumpulan.tangguh, 'pengajian');
}

function render_seksyen_risiko(id_el, senarai, mod) {
  const el = document.getElementById(id_el);
  if (!el) return;
  if (senarai.length === 0) {
    el.innerHTML = `<div style="color:var(--hijau);font-size:13px;padding:8px 0">✓ Tiada pelajar dalam kategori ini.</div>`;
    return;
  }
  el.innerHTML = `
    <div class="jadual-balut"><table class="jadual">
      <thead><tr>
        <th>No. Matrik</th><th>Nama</th><th>Kelas</th>
        <th>PA</th><th>Pengajian</th><th>Takaful</th><th>Tindakan</th>
      </tr></thead>
      <tbody>${senarai.map(p => `
        <tr>
          <td>${p.id}</td>
          <td><span class="pautan-pelajar" onclick="buka_profil('${p.id}')">${p.nama}</span></td>
          <td>${kelas_paparan(p)}</td>
          <td>${p.nama_pa || '—'}</td>
          <td>${lencana_pengajian(p.status_pengajian)}</td>
          <td>${lencana_takaful(p.status_takaful)}</td>
          <td>
            <button class="btn btn-biasa btn-kecil" onclick="buka_profil('${p.id}')">👁 Profil</button>
            ${mod === 'bayar' ? `<button class="btn btn-amaran btn-kecil" onclick="buka_bayaran_pelajar('${p.id}')">💳 Rekod</button>` : ''}
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}
