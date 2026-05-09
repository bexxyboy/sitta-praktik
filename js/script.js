// ============================================
// SITTA UT - GLOBAL SCRIPT
// Fungsi-fungsi yang digunakan di seluruh halaman
// ============================================

// ===== AUTHENTICATION =====
function checkAuth() {
    const userRaw = sessionStorage.getItem('user');
    if (!userRaw) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(userRaw);
}

function doLogout() {
    if (confirm('Apakah Anda yakin ingin keluar dari SITTA?')) {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

function getCurrentUser() {
    const userRaw = sessionStorage.getItem('user');
    return userRaw ? JSON.parse(userRaw) : null;
}

// ===== NAVBAR FUNCTIONS =====
function initNavbar() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    // Set user name
    const userNameEl = document.getElementById('navUserName');
    if (userNameEl) userNameEl.textContent = currentUser.nama || '—';
    
    // Set user role
    const userRoleEl = document.getElementById('navUserRole');
    if (userRoleEl) userRoleEl.textContent = currentUser.role || '—';
    
    // Set avatar
    const avatarEl = document.getElementById('navAvatar');
    if (avatarEl) {
        avatarEl.textContent = (currentUser.nama || 'U')[0].toUpperCase();
    }
    
    // Show/hide pengguna menu for Administrator
    if (currentUser.role === 'Administrator') {
        const navPengguna = document.getElementById('navPengguna');
        const cardPengguna = document.getElementById('cardPengguna');
        if (navPengguna) navPengguna.style.display = '';
        if (cardPengguna) cardPengguna.style.display = '';
    }
    
    return currentUser;
}

// ===== MODAL FUNCTIONS =====
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function setupModalCloseOnOverlay() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });
}

// ===== GREETING FUNCTIONS =====
function setGreeting(nama) {
    const hour = new Date().getHours();
    let greet, icon;
    if (hour >= 4 && hour < 11) { greet = 'Selamat Pagi'; icon = '🌅'; }
    else if (hour >= 11 && hour < 15) { greet = 'Selamat Siang'; icon = '☀️'; }
    else if (hour >= 15 && hour < 19) { greet = 'Selamat Sore'; icon = '🌤️'; }
    else { greet = 'Selamat Malam'; icon = '🌙'; }
    
    const greetingText = document.getElementById('greetingText');
    const greetingSubtext = document.getElementById('greetingSubtext');
    const greetingIcon = document.getElementById('greetingIcon');
    
    if (greetingText) greetingText.textContent = `${greet}, ${nama || 'Pengguna'}!`;
    if (greetingSubtext && getCurrentUser()) {
        const user = getCurrentUser();
        greetingSubtext.textContent = `Peran Anda: ${user.role || '—'} — ${user.lokasi || '—'}`;
    }
    if (greetingIcon) greetingIcon.textContent = icon;
}

// ===== TABLE RENDER FUNCTIONS =====
function renderRecentTracking(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody || typeof dataTracking === 'undefined') return;
    
    tbody.innerHTML = '';
    Object.values(dataTracking).forEach(t => {
        const statusClass = t.status === 'Dikirim' ? 'badge-success' : 'badge-warning';
        tbody.innerHTML += `
            <tr>
                <td><span style="font-family:var(--font-mono);font-size:0.8rem;">${t.nomorDO}</span></td>
                <td><strong>${t.nama}</strong></td>
                <td>${t.ekspedisi}</td>
                <td>${t.tanggalKirim}</td>
                <td><span class="badge ${statusClass}">${t.status}</span></td>
            </tr>
        `;
    });
}

function renderMonitoringTable(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody || typeof dataTracking === 'undefined') return;
    
    tbody.innerHTML = '';
    Object.values(dataTracking).forEach(t => {
        const pct = t.status === 'Dikirim' ? 100 : Math.round((t.perjalanan.length / 6) * 100);
        const color = pct === 100 ? 'var(--success)' : 'var(--primary)';
        const statusClass = t.status === 'Dikirim' ? 'badge-success' : 'badge-warning';
        tbody.innerHTML += `
            <tr>
                <td><span style="font-family:var(--font-mono);font-size:0.8rem;">${t.nomorDO}</span></td>
                <td>${t.nama}</td>
                <td>${t.ekspedisi}</td>
                <td>${t.paket}</td>
                <td>${t.total}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="flex:1;height:8px;background:var(--gray-200);border-radius:4px;overflow:hidden;">
                            <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;transition:width 0.6s;"></div>
                        </div>
                        <span style="font-size:0.75rem;font-weight:600;color:var(--gray-700);white-space:nowrap;">${pct}%</span>
                    </div>
                </td>
                <td><span class="badge ${statusClass}">${t.status}</span></td>
            </tr>
        `;
    });
}

function renderRekapTable(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody || typeof dataBahanAjar === 'undefined') return;
    
    tbody.innerHTML = '';
    dataBahanAjar.forEach(b => {
        const stokClass = b.stok < 200 ? 'stok-low' : 'stok-high';
        const stokLabel = b.stok < 200 ? '<span class="badge badge-danger">Perlu Restock</span>' : '<span class="badge badge-success">Tersedia</span>';
        tbody.innerHTML += `
            <tr>
                <td><code style="font-size:0.8rem;">${b.kodeLokasi}</code></td>
                <td><code style="font-size:0.8rem;">${b.kodeBarang}</code></td>
                <td><strong>${b.namaBarang}</strong></td>
                <td>${b.jenisBarang}</td>
                <td>Ed. ${b.edisi}</td>
                <td class="stok-number ${stokClass}">${b.stok}</td>
                <td>${stokLabel}</td>
            </tr>
        `;
    });
}

function renderHistoriTable(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody || typeof dataTracking === 'undefined') return;
    
    tbody.innerHTML = '';
    Object.values(dataTracking).forEach(t => {
        const statusClass = t.status === 'Dikirim' ? 'badge-success' : 'badge-warning';
        tbody.innerHTML += `
            <tr>
                <td><span style="font-family:var(--font-mono);font-size:0.8rem;">${t.nomorDO}</span></td>
                <td><strong>${t.nama}</strong></td>
                <td>${t.ekspedisi}</td>
                <td>${t.tanggalKirim}</td>
                <td>${t.paket}</td>
                <td>${t.total}</td>
                <td><span class="badge ${statusClass}">${t.status}</span></td>
                <td><a href="tracking.html?do=${t.nomorDO}" class="btn btn-outline btn-sm">🔍 Detail</a></td>
            </tr>
        `;
    });
}

// ===== HELPER FUNCTIONS =====
function formatNumber(num) {
    return num.toLocaleString('id-ID');
}

function getInitials(nama) {
    return nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function getAvatarColor(id) {
    const colors = ['#1a56db', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[id % colors.length];
}

// Role badge colors
const roleColors = {
    'Administrator': 'badge-danger',
    'UPBJJ-UT': 'badge-info',
    'Puslaba': 'badge-warning',
    'Fakultas': 'badge-success'
};

// ===== PASSWORD TOGGLE =====
function togglePassword(inputId, toggleBtnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(toggleBtnId);
    if (!input || !btn) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// ===== INITIALIZE ALL PAGES =====
document.addEventListener('DOMContentLoaded', function() {
    setupModalCloseOnOverlay();
    
    if (document.getElementById('greetingText')) {
        const user = getCurrentUser();
        if (user) setGreeting(user.nama);
    }
    
    initNavbar();
});