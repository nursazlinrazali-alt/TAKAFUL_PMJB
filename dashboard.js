/* ============================================================
   dashboard.js — Statistik & Carta Halaman Utama
   ============================================================ */

let chartTakaful = null;
let chartPengajian = null;

function render_dashboard() {
  const senarai = semua_pelajar();
  const sem = dapatkan_semester();

  // Statistik
  const jml = senarai.length;
  const bayar = senarai.filter(p => p.status_takaful === 'bayar').length;
  const belum = senarai.filter(p => p.status_takaful === 'belum_bayar').length;
  const tunggu = senarai.filter(p => p.status_takaful === 'tunggu').length;
  const repeat_n = senarai.filter(p => p.status_pengajian === 'repeat').length;
  const extend_n = senarai.filter(p => p.status_pengajian === 'extend').length;
  const junior_n = senarai.filter(p => p.status_pengajian === 'junior').length;
  const tangguh_n = senarai.filter(p => p.status_pengajian === 'tangguh').length;
  const bermasalah = repeat_n + extend_n + junior_n + tangguh_n;

  // Kemas kad
  set_teks('kad-jumlah',  jml);
  set_teks('kad-bayar',   bayar);
  set_teks('kad-belum',   belum + tunggu);
  set_teks('kad-tunggu',  tunggu);
  set_teks('kad-bermasalah', bermasalah);
  set_teks('kad-repeat',  repeat_n);

  // Semester
  const el_sem = document.getElementById('info-semester');
  if (el_sem) {
    const mula = new Date(sem.tarikh_mula);
    const hari = Math.floor((new Date() - mula) / 864e5);
    el_sem.textContent = `${sem.nama} • Hari ke-${hari + 1}`;
  }
  const el_badge = document.querySelector('.semester-badge');
  if (el_badge) el_badge.textContent = sem.nama;

  // Carta pai — Takaful
  const ctx1 = document.getElementById('carta-takaful');
  if (ctx1) {
    if (chartTakaful) chartTakaful.destroy();
    chartTakaful = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Sudah Bayar', 'Belum Bayar', 'Menunggu Sahkan', 'Pengecualian'],
        datasets: [{
          data: [
            bayar,
            belum,
            tunggu,
            senarai.filter(p => p.status_takaful === 'pengecualian').length
          ],
          backgroundColor: ['#27ae60','#e74c3c','#f39c12','#2980b9'],
          borderWidth: 2, borderColor: '#fff'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 14 } }
        },
        cutout: '60%'
      }
    });
  }

  // Carta bar — Status Pengajian
  const ctx2 = document.getElementById('carta-pengajian');
  if (ctx2) {
    if (chartPengajian) chartPengajian.destroy();
    chartPengajian = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Aktif', 'Repeat', 'Extend', 'Junior', 'Tangguh'],
        datasets: [{
          label: 'Bilangan Pelajar',
          data: [
            senarai.filter(p => p.status_pengajian === 'aktif').length,
            repeat_n, extend_n, junior_n, tangguh_n
          ],
          backgroundColor: ['#27ae60','#e67e22','#2980b9','#8e44ad','#95a5a6'],
          borderRadius: 5,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Pelajar perlu perhatian segera (belum bayar, repeat/extend)
  const perhatian = senarai
    .filter(p => p.status_takaful === 'belum_bayar' || ['repeat','extend','junior'].includes(p.status_pengajian))
    .slice(0, 8);
  const el = document.getElementById('senarai-perhatian-dash');
  if (el) {
    if (perhatian.length === 0) {
      el.innerHTML = '<div class="tiada-data"><div class="tiada-data-ikon">🎉</div><p>Tiada pelajar memerlukan perhatian segera!</p></div>';
    } else {
      el.innerHTML = perhatian.map(p => `
        <div class="item-log" style="cursor:pointer" onclick="buka_profil('${p.id}')">
          <div style="flex:1">
            <strong>${p.nama}</strong> <span style="color:var(--kelabu-gelap);font-size:12px">${p.id}</span><br>
            <span style="font-size:12px">${p.kelas_semasa} &nbsp;|&nbsp; ${lencana_pengajian(p.status_pengajian)} &nbsp;${lencana_takaful(p.status_takaful)}</span>
          </div>
          <span style="color:var(--biru-cerah);font-size:12px">→</span>
        </div>`).join('');
    }
  }
}
