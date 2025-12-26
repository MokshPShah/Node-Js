// ==========================================
// DOM READY & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initUserDropdown();
    initImagePreview();
    initAddAdminValidation();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Dashboard charts (ONLY if dashboard page)
    if (document.getElementById('revenueChart')) {
        initDashboardCharts();
    }
});

// ==========================================
// 1. SIDEBAR & NAVBAR LOGIC
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
// 2. DASHBOARD CHARTS
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
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
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
                plugins: { legend: { display: false } }
            }
        });
    }
}

// ==========================================
// 3. ADD ADMIN PAGE LOGIC
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
// 4. VIEW / EDIT / DELETE ACTIONS (Backend Connected)
// ==========================================

/**
 * VIEW ADMIN DETAILS
 */
/**
 * VIEW ADMIN DETAILS
 */
window.viewAdmin = function (id) {
    // 1. Fetch data from backend
    fetch(`/adminDetails/${id.trim()}`)
        .then(res => res.json())
        .then(admin => {

            // 2. Format Date safely
            const joinedDate = admin.date
                ? new Date(admin.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'N/A';

            // 3. Format Hobbies safely
            const hobbies = (admin.hobby && Array.isArray(admin.hobby))
                ? admin.hobby.join(', ')
                : 'None';

            // 4. Inject HTML into Modal
            openModalContent(`
                <div class="text-center mb-6">
                    <div class="relative inline-block">
                        <img src="${admin.avatar}" 
                             onerror="this.src='https://ui-avatars.com/api/?name=${admin.name}&background=cbd5e1&color=fff&size=128'"
                             class="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-lg object-cover">
                        <div class="absolute bottom-1 right-1 bg-green-500 w-4 h-4 border-2 border-white rounded-full"></div>
                    </div>

                    <h2 class="text-2xl font-bold mt-4 text-slate-800">${admin.name}</h2>
                    <p class="text-slate-500 font-medium">${admin.email}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gender</span>
                        <span class="text-slate-700 font-semibold text-base">${admin.gender}</span>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Joined On</span>
                        <span class="text-slate-700 font-semibold text-base">${joinedDate}</span>
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hobbies & Interests</h4>
                    <div class="flex flex-wrap gap-2">
                        ${(admin.hobby || []).map(h => `
                            <span class="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                                ${h}
                            </span>
                        `).join('') || '<span class="text-slate-400 italic">No hobbies listed</span>'}
                    </div>
                </div>

                <div class="mb-8">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</h4>
                    <p class="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                        ${admin.desc || 'No description provided.'}
                    </p>
                </div>

                <div class="flex justify-center">
                    <button onclick="closeModal()" 
                        class="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-slate-200">
                        Close Profile
                    </button>
                </div>
            `);
        })
        .catch(err => {
            console.error("Error fetching admin details:", err);
            alert("Failed to load details. Check your connection.");
        });
};

/**
 * OPEN EDIT MODAL & POPULATE FORM
 */
window.openEditModal = function (id) {
    fetch(`/admin-details/${id.trim()}`)
        .then(res => res.json())
        .then(admin => {

            // Helper to check hobbies
            const isHobbyChecked = (val) => admin.hobby && admin.hobby.includes(val) ? 'checked' : '';

            // Format date for input[type="date"] (YYYY-MM-DD)
            let dateValue = '';
            if (admin.date) {
                dateValue = new Date(admin.date).toISOString().split('T')[0];
            }

            openModalContent(`
                <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                    <h3 class="text-xl font-bold text-slate-800">Edit Admin Profile</h3>
                    <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <form id="editForm" onsubmit="saveEdit(event, '${admin._id}')" enctype="multipart/form-data">
                    
                    <div class="flex items-center mb-6">
                        <img id="edit-preview" 
                             src="/uploads/adminImages/${admin.avatar}" 
                             onerror="this.src='https://ui-avatars.com/api/?name=${admin.name}'"
                             class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mr-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Change Photo</label>
                            <input type="file" id="edit-image-input" onchange="previewEditImage(this)" accept="image/*" 
                                class="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                            <input type="text" id="edit-name" value="${admin.name}" required
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                            <input type="email" id="edit-email" value="${admin.email}" required
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                    </div>

                     <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Date Joined</label>
                            <input type="date" id="edit-date" value="${dateValue}"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-500 uppercase mb-2">Gender</label>
                            <div class="flex space-x-4">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="edit-gender" value="Male" ${admin.gender === 'Male' ? 'checked' : ''} class="text-indigo-600">
                                    <span class="ml-2 text-sm">Male</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="edit-gender" value="Female" ${admin.gender === 'Female' ? 'checked' : ''} class="text-indigo-600">
                                    <span class="ml-2 text-sm">Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-xs font-semibold text-slate-500 uppercase mb-2">Hobbies</label>
                        <div class="flex flex-wrap gap-2">
                            ${['Coding', 'Design', 'Marketing', 'Reading', 'Travelling', 'Gaming'].map(hobby => `
                                <label class="inline-flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-white">
                                    <input type="checkbox" name="edit-hobby" value="${hobby}" ${isHobbyChecked(hobby)} class="rounded text-indigo-600 focus:ring-indigo-500">
                                    <span class="ml-2 text-sm text-slate-600">${hobby}</span>
                                </label>
                            `).join('')}
                        </div>    
                    </div>

                    <div class="mb-6">
                        <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Bio</label>
                        <textarea id="edit-desc" rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">${admin.desc || ''}</textarea>
                    </div>

                    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition">Save Changes</button>
                    </div>
                </form>
            `);
        })
        .catch(err => {
            console.error(err);
            alert("Error loading admin for editing.");
        });
};

/**
 * PREVIEW IMAGE IN EDIT MODAL
 */
window.previewEditImage = function (input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('edit-preview').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
};

/**
 * SAVE EDITED DATA
 */
window.saveEdit = function (e, id) {
    e.preventDefault();

    const formData = new FormData();

    // Append Fields
    formData.append('name', document.getElementById('edit-name').value);
    formData.append('email', document.getElementById('edit-email').value);
    formData.append('gender', document.querySelector('input[name="edit-gender"]:checked')?.value || '');
    formData.append('date', document.getElementById('edit-date').value);
    formData.append('desc', document.getElementById('edit-desc').value);

    // Append Hobbies
    document.querySelectorAll('input[name="edit-hobby"]:checked')
        .forEach(cb => formData.append('hobby', cb.value));

    // Append Image (Only if selected)
    const imageInput = document.getElementById('edit-image-input');
    if (imageInput && imageInput.files.length > 0) {
        formData.append('avatar', imageInput.files[0]);
    }

    // Send Request
    fetch(`/update-admin/${id}`, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                closeModal();
                // Reload page to reflect changes
                window.location.reload();
            } else {
                alert(result.message || 'Update failed');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Something went wrong during update');
        });
};

/**
 * DELETE ADMIN
 */
window.deleteAdmin = function (id) {
    if (!confirm("Are you sure you want to permanently delete this admin?")) {
        return;
    }

    fetch(`/delete-admin/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success || result.message === 'Admin deleted successfully') { // Adjust based on your backend response
                // Remove row from UI instantly or reload
                const row = document.getElementById(`row-${id}`); // Ensure your TR has id="row-USER_ID"
                if (row) {
                    row.remove();
                } else {
                    window.location.reload();
                }
            } else {
                alert("Failed to delete admin.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error deleting admin.");
        });
};

// ==========================================
// 5. MODAL UTILITIES
// ==========================================
window.openModalContent = function (html) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');

    content.innerHTML = html;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    if (window.lucide) lucide.createIcons();
};

window.closeModal = function () {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
};

// Close modal when clicking on overlay
const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}
// ==========================================
// ADD ADMIN FORM VALIDATION (ALL FIELDS)
// ==========================================
function initAddAdminValidation() {
    const form = document.getElementById('addAdminForm');
    const errorContainer = document.getElementById('client-error-container');

    if (!form) return;

    form.addEventListener('submit', function (e) {

        const fnameInput = document.getElementById('fname');
        const lnameInput = document.getElementById('lname');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const dateInput = document.getElementById('date-field');
        const descInput = document.getElementById('description');
        const imageInput = document.getElementById('adminImage');

        const genderChecked = document.querySelector('input[name="gender"]:checked');
        const hobbiesChecked = document.querySelectorAll('input[name="hobby"]:checked');

        let errorMessage = '';

        if (!fnameInput || !fnameInput.value.trim()) {
            errorMessage = "First Name is required.";
        }
        else if (!lnameInput || !lnameInput.value.trim()) {
            errorMessage = "Last Name is required.";
        }
        else if (!emailInput || !emailInput.value.trim()) {
            errorMessage = "Email Address is required.";
        }
        else if (!passwordInput || !passwordInput.value.trim()) {
            errorMessage = "Password is required.";
        }
        else if (!dateInput || !dateInput.value) {
            errorMessage = "Date Joined is required.";
        }
        else if (!genderChecked) {
            errorMessage = "Please select a Gender.";
        }
        else if (hobbiesChecked.length === 0) {
            errorMessage = "Please select at least one Hobby.";
        }
        else if (!descInput || !descInput.value.trim()) {
            errorMessage = "Short Bio / Description is required.";
        }
        else if (!imageInput || imageInput.files.length === 0) {
            errorMessage = "Profile Image is required.";
        }

        if (errorMessage) {
            e.preventDefault();

            if (errorContainer) {
                errorContainer.textContent = errorMessage;

                errorContainer.classList.remove('hidden');

                errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert(errorMessage);
            }
            return false;
        }

        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
    });
}