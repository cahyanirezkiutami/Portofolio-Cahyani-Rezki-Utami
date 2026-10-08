/**
 * Portfolio Web Application
 * Interaktivitas dan Integrasi Local Storage
 */

// =============================================================================
// 1. DATA DEFAULT & KUNCI LOCAL STORAGE
// =============================================================================
const STORAGE_KEYS = {
    THEME: 'portfolio_theme',
    PROJECTS: 'portfolio_projects',
    MESSAGES: 'portfolio_messages'
};

const DEFAULT_PROJECTS = [
    {
        id: 1,
        title: 'Aplikasi E-Commerce Minimalis',
        category: 'Web Development',
        desc: 'Platform toko online responsif dengan katalog produk dinamis, filter kategori, dan manajemen keranjang belanja.',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=600&auto=format&fit=crop',
        link: 'https://github.com'
    },
    {
        id: 2,
        title: 'Task & Project Management Dashboard',
        category: 'Web Development',
        desc: 'Aplikasi manajemen produktivitas dengan pengelompokan status tugas, deadline tracker, dan penyimpanan lokal.',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
        link: 'https://github.com'
    },
    {
        id: 3,
        title: 'Modern Finance App UI Concept',
        category: 'UI/UX Design',
        desc: 'Desain antarmuka dompet digital interaktif dengan visualisasi pengeluaran dan alur transaksi yang ramah pengguna.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
        link: 'https://github.com'
    }
];

// =============================================================================
// 2. INISIALISASI SETELAH DOM SIAP
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initProjects();
    initContactForm();
    initActiveNavScroll();
});

// =============================================================================
// 3. FITUR THEME TOGGLE (LOCAL STORAGE)
// =============================================================================
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Baca preferensi tema dari Local Storage (default: light)
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    applyTheme(savedTheme, themeIcon);

    // Event listener saat tombol tema diklik
    themeToggleBtn.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const nextTheme = isDarkMode ? 'light' : 'dark';
        
        // Simpan ke Local Storage
        localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
        applyTheme(nextTheme, themeIcon);
    });
}

function applyTheme(theme, iconElement) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (iconElement) {
            iconElement.classList.remove('fa-moon');
            iconElement.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (iconElement) {
            iconElement.classList.remove('fa-sun');
            iconElement.classList.add('fa-moon');
        }
    }
}

// =============================================================================
// 4. FITUR NAVIGASI MOBILE & AKTIF SAAT SCROLL
// =============================================================================
function initMobileNav() {
    const hamburgerBtn = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Tutup menu saat salah satu link diklik
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
}

function initActiveNavScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// =============================================================================
// 5. FITUR CRUD PROYEK (LOCAL STORAGE)
// =============================================================================
function getProjectsFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!stored) {
        // Simpan data default pertama kali ke Local Storage
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
        return DEFAULT_PROJECTS;
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error('Gagal membaca data proyek dari Local Storage:', e);
        return DEFAULT_PROJECTS;
    }
}

function saveProjectsToStorage(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    const projects = getProjectsFromStorage();

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>Belum ada proyek yang ditambahkan. Gunakan formulir di bawah untuk menambah proyek ke Local Storage!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map((proj, index) => {
        const fallbackImg = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop';
        const imgSrc = proj.image && proj.image.trim() !== '' ? proj.image : fallbackImg;
        const projectLinkHtml = proj.link && proj.link.trim() !== '' 
            ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener noreferrer" class="project-link-btn">Lihat Detail <i class="fas fa-external-link-alt"></i></a>`
            : `<span class="project-link-btn" style="color: var(--text-muted); cursor: default;">Internal Project</span>`;

        return `
            <div class="project-card">
                <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(proj.title)}" class="project-thumb" onerror="this.src='${fallbackImg}'">
                <div class="project-content">
                    <span class="project-category-tag">${escapeHtml(proj.category || 'General')}</span>
                    <h3 class="project-card-title">${escapeHtml(proj.title)}</h3>
                    <p class="project-card-desc">${escapeHtml(proj.desc)}</p>
                    <div class="project-card-actions">
                        <div class="project-links">
                            ${projectLinkHtml}
                        </div>
                        <div class="card-manage-btns">
                            <button class="icon-btn edit-btn" title="Edit Proyek" onclick="editProject(${index})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="icon-btn delete-btn" title="Hapus Proyek" onclick="deleteProject(${index})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function initProjects() {
    renderProjects();

    const form = document.getElementById('projectForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const resetProjectsBtn = document.getElementById('resetProjectsBtn');

    if (!form) return;

    // Form Submit (Tambah atau Perbarui Proyek)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const editIndex = parseInt(document.getElementById('editIndex').value, 10);
        const title = document.getElementById('projTitle').value.trim();
        const category = document.getElementById('projCategory').value;
        const desc = document.getElementById('projDesc').value.trim();
        const image = document.getElementById('projImage').value.trim();
        const link = document.getElementById('projLink').value.trim();

        if (!title || !desc) {
            alert('Mohon isi Judul dan Deskripsi proyek!');
            return;
        }

        const projects = getProjectsFromStorage();

        if (editIndex >= 0 && editIndex < projects.length) {
            // Update Proyek
            projects[editIndex] = {
                ...projects[editIndex],
                title,
                category,
                desc,
                image,
                link
            };
        } else {
            // Tambah Proyek Baru
            const newProject = {
                id: Date.now(),
                title,
                category,
                desc,
                image,
                link
            };
            projects.push(newProject);
        }

        // Simpan ke Local Storage dan Render Ulang
        saveProjectsToStorage(projects);
        renderProjects();
        resetProjectForm();
    });

    // Tombol Batal Edit
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', resetProjectForm);
    }

    // Tombol Reset ke Proyek Default
    if (resetProjectsBtn) {
        resetProjectsBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mengembalikan daftar proyek ke data bawaan?')) {
                localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
                renderProjects();
                resetProjectForm();
            }
        });
    }
}

// Fungsi Edit Proyek (diekspos secara global)
window.editProject = function(index) {
    const projects = getProjectsFromStorage();
    const proj = projects[index];
    if (!proj) return;

    document.getElementById('editIndex').value = index;
    document.getElementById('projTitle').value = proj.title;
    document.getElementById('projCategory').value = proj.category || 'Web Development';
    document.getElementById('projDesc').value = proj.desc;
    document.getElementById('projImage').value = proj.image || '';
    document.getElementById('projLink').value = proj.link || '';

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Simpan Perubahan';
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) cancelEditBtn.style.display = 'inline-flex';

    // Scroll otomatis ke formulir edit
    document.querySelector('.project-manager').scrollIntoView({ behavior: 'smooth' });
};

// Fungsi Hapus Proyek (diekspos secara global)
window.deleteProject = function(index) {
    const projects = getProjectsFromStorage();
    if (index < 0 || index >= projects.length) return;

    if (confirm(`Hapus proyek "${projects[index].title}" dari Local Storage?`)) {
        projects.splice(index, 1);
        saveProjectsToStorage(projects);
        renderProjects();
        resetProjectForm();
    }
};

function resetProjectForm() {
    const form = document.getElementById('projectForm');
    if (!form) return;

    form.reset();
    document.getElementById('editIndex').value = '-1';
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Tambah Proyek';

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';
}

// =============================================================================
// 6. FITUR FORM KONTAK & PESAN MASUK (LOCAL STORAGE)
// =============================================================================
function getMessagesFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error('Gagal membaca pesan dari Local Storage:', e);
        return [];
    }
}

function saveMessagesToStorage(messages) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

function renderMessages() {
    const panel = document.getElementById('messagesPanel');
    const list = document.getElementById('messagesList');
    if (!panel || !list) return;

    const messages = getMessagesFromStorage();

    if (messages.length === 0) {
        panel.style.display = 'none';
        list.innerHTML = '';
        return;
    }

    panel.style.display = 'block';
    list.innerHTML = messages.map((msg, idx) => `
        <div class="message-item">
            <div>
                <div class="message-header">
                    <span class="message-name">${escapeHtml(msg.name)}</span>
                    <span class="message-email">&lt;${escapeHtml(msg.email)}&gt;</span>
                    <span class="message-time">${escapeHtml(msg.time)}</span>
                </div>
                <div class="message-text">${escapeHtml(msg.message)}</div>
            </div>
            <button class="icon-btn delete-btn" title="Hapus Pesan" onclick="deleteMessage(${idx})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function initContactForm() {
    renderMessages();

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const clearMessagesBtn = document.getElementById('clearMessagesBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) return;

            const newMessage = {
                id: Date.now(),
                name,
                email,
                message,
                time: new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            // Simpan ke Local Storage
            const messages = getMessagesFromStorage();
            messages.unshift(newMessage); // Tambahkan di urutan paling atas
            saveMessagesToStorage(messages);

            contactForm.reset();
            renderMessages();

            // Tampilkan notifikasi sukses sementara
            if (formSuccess) {
                formSuccess.style.display = 'flex';
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 4000);
            }
        });
    }

    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', () => {
            if (confirm('Hapus semua riwayat pesan dari Local Storage?')) {
                localStorage.removeItem(STORAGE_KEYS.MESSAGES);
                renderMessages();
            }
        });
    }
}

// Fungsi Hapus Pesan Tunggal
window.deleteMessage = function(index) {
    const messages = getMessagesFromStorage();
    if (index >= 0 && index < messages.length) {
        messages.splice(index, 1);
        saveMessagesToStorage(messages);
        renderMessages();
    }
};

// =============================================================================
// 7. HELPER FUNCTION: SANITASI STRING HTML
// =============================================================================
function escapeHtml(text) {
    if (!text) return '';
    return text
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
