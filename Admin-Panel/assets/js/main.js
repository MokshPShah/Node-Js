// ==========================================
// DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initUserDropdown();
    initImagePreview();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Dashboard charts (ONLY if dashboard page)
    if (document.getElementById('revenueChart')) {
        initDashboardCharts();
    }
});

// ==========================================
// SIDEBAR DROPDOWN
// ==========================================
function initSidebar() {
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownIcon = document.getElementById('dropdown-icon');

    if (!dropdownBtn || !dropdownMenu) return;

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
        if (dropdownIcon) {
            dropdownIcon.style.transform = dropdownMenu.classList.contains('hidden')
                ? 'rotate(0deg)'
                : 'rotate(180deg)';
        }
    });
}

// ==========================================
// USER DROPDOWN
// ==========================================
function initUserDropdown() {
    const btn = document.getElementById('user-menu-btn');
    const menu = document.getElementById('user-dropdown');
    const chevron = document.getElementById('user-chevron');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        if (chevron) {
            chevron.style.transform = menu.classList.contains('hidden')
                ? 'rotate(0deg)'
                : 'rotate(180deg)';
        }
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    });
}

// ==========================================
// IMAGE PREVIEW (ADD ADMIN PAGE)
// ==========================================
function initImagePreview() {
    const imgInput = document.getElementById('adminImage');
    const imgPreview = document.getElementById('imagePreview');

    if (!imgInput || !imgPreview) return;

    imgInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = e => imgPreview.src = e.target.result;
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// ==========================================
// DASHBOARD CHARTS
// ==========================================
function initDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 22000, 24000, 28000],
                    backgroundColor: '#4f46e5',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Organic'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#6366f1', '#60a5fa', '#cbd5e1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function viewAdmin(id) {
    fetch(`/admin-details/${id.trim()}`)
        .then(res => res.json())
        .then(admin => {

            openModalContent(`
                <div class="text-center mb-6">
                    <img src="/uploads/adminImages/${admin.avatar}"
                         class="w-24 h-24 rounded-full mx-auto border-4 border-slate-100 shadow-sm object-cover">

                    <h2 class="text-xl font-bold mt-3 text-slate-900">${admin.name}</h2>
                    <p class="text-indigo-600 font-medium">${admin.email}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div class="bg-slate-50 p-3 rounded">
                        <strong>Gender:</strong> ${admin.gender}
                    </div>
                    <div class="bg-slate-50 p-3 rounded">
                        <strong>Joined:</strong> ${new Date(admin.date).toLocaleDateString()}
                    </div>
                </div>

                <div class="bg-slate-50 p-3 rounded mb-4 text-sm">
                    <strong>Hobbies:</strong> ${(admin.hobby || []).join(', ') || 'None'}
                </div>

                <div class="bg-slate-50 p-3 rounded mb-6 text-sm">
                    <strong>Bio:</strong>
                    <p class="mt-1 text-slate-600 italic">${admin.desc || 'No description.'}</p>
                </div>

                <div class="text-center">
                    <button onclick="closeModal()"
                        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded
                               text-slate-700 font-medium">
                        Close
                    </button>
                </div>
            `);

        });
}


function openEditModal(id) {
    fetch(`/admin-details/${id.trim()}`)
        .then(res => res.json())
        .then(admin => {

            openModalContent(`
                <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                <h3 class="text-xl font-bold text-slate-800">Edit Admin Profile</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600">
                <i data-lucide="x" class="w-5 h-5"></i>
                </button>
                </div>

                <form id="editForm" onsubmit="saveEdit(event, '${admin._id}')">

                <div class="flex items-center mb-6">
                <img id="edit-preview"
                        src="/uploads/adminImages/${admin.avatar}"
                        class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mr-4">

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">
                        Change Photo
                    </label>
                    <input type="file"
                            id="edit-image-input"
                            onchange="previewEditImage(this)"
                            accept="image/*"
                            class="block w-full text-xs text-slate-500
                                    file:mr-2 file:py-1 file:px-3
                                    file:rounded-full file:border-0
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100 cursor-pointer"/>
                </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Full Name
                    </label>
                    <input type="text"
                            id="edit-name"
                            value="${admin.name}"
                            class="w-full border border-slate-300 rounded-lg
                                    px-3 py-2 text-sm focus:ring-2
                                    focus:ring-indigo-500 outline-none"
                            required>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Email
                    </label>
                    <input type="email"
                            id="edit-email"
                            value="${admin.email}"
                            class="w-full border border-slate-300 rounded-lg
                                    px-3 py-2 text-sm focus:ring-2
                                    focus:ring-indigo-500 outline-none"
                            required>
                </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Date Joined
                    </label>
                    <input type="date"
                            id="edit-date"
                            value="${admin.date || ''}"
                            class="w-full border border-slate-300 rounded-lg
                                    px-3 py-2 text-sm focus:ring-2
                                    focus:ring-indigo-500 outline-none">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-2">
                        Gender
                    </label>
                    <div class="flex space-x-4">
                        <label class="flex items-center cursor-pointer">
                            <input type="radio"
                                    name="edit-gender"
                                    value="Male"
                                    ${admin.gender === 'Male' ? 'checked' : ''}
                                    class="text-indigo-600">
                            <span class="ml-2 text-sm">Male</span>
                        </label>

                        <label class="flex items-center cursor-pointer">
                            <input type="radio"
                                    name="edit-gender"
                                    value="Female"
                                    ${admin.gender === 'Female' ? 'checked' : ''}
                                    class="text-indigo-600">
                            <span class="ml-2 text-sm">Female</span>
                        </label>
                    </div>
                </div>
                </div>

                <div class="mb-4">
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-2">
                        Hobbies
                    </label>
                    <div class="flex flex-wrap gap-2">
                        ${['Coding', 'Design', 'Marketing', 'Reading', 'Travelling', 'Gaming'].map(hobby => `
                            <label class="inline-flex items-center bg-slate-50 px-3 py-1.5 rounded-full border">
                                <input type="checkbox" name="edit-hobby" value="${hobby}"
                                    ${admin.hobby.includes(hobby) ? 'checked' : ''}>
                                <span class="ml-2 text-sm">${hobby}</span>
                            </label>
                        `).join('')}
                    </div>    
                </div>

                <div class="mb-6">
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Bio
                    </label>
                    <textarea id="edit-desc" rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">${admin.desc || ''}</textarea>
                    </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition"> Cancel </button>

                <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition"> Save Changes </button>
                </div>
                </form>
            `);


        });
}

function saveEdit(e, id) {
    e.preventDefault();

    const formData = new FormData();

    // Basic fields
    formData.append('name', document.getElementById('edit-name').value);
    formData.append('email', document.getElementById('edit-email').value);
    formData.append('gender',
        document.querySelector('input[name="edit-gender"]:checked')?.value || ''
    );
    formData.append('date', document.getElementById('edit-date').value);
    formData.append('desc', document.getElementById('edit-desc').value);

    // Password (optional)
    const password = document.getElementById('edit-password');
    if (password && password.value.trim() !== '') {
        formData.append('password', password.value);
    }

    // Hobbies (multiple)
    document
        .querySelectorAll('input[name="edit-hobby"]:checked')
        .forEach(cb => formData.append('hobby', cb.value));

    // Image (optional)
    const imageInput = document.getElementById('edit-image-input');
    if (imageInput && imageInput.files.length > 0) {
        formData.append('avatar', imageInput.files[0]);
    }

    fetch(`/update-admin/${id}`, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                closeModal();
                location.reload(); // simple & safe
            } else {
                alert(result.message || 'Update failed');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong');
        });
}


function openModalContent(html) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');

    content.innerHTML = html;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    if (window.lucide) lucide.createIcons();
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
}

