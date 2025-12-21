// ==========================================
// 1. MOCK DATA
// ==========================================
let mockAdmins = [
    {
        id: 101,
        name: "Sarah Jenkins",
        email: "sarah@nexus.com",
        gender: "Female",
        hobbies: ["Reading", "Travel"], // Matches checks
        description: "Senior Admin with 5 years experience.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        date: "Oct 24, 2023"
    },
    {
        id: 102,
        name: "Michael Chen",
        email: "m.chen@nexus.com",
        gender: "Male",
        hobbies: ["Coding"],
        description: "System Architect.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        date: "Nov 05, 2023"
    }
];

// Global variable to hold temporary edit image
let tempEditImage = null;

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initUserDropdown(); // Initialize the Navbar Dropdown
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Routing Logic
    if (document.getElementById('revenueChart')) initDashboard();
    else if (document.getElementById('addAdminForm')) initAddAdmin();
    else if (document.getElementById('adminTableBody')) initViewAdmin();
});

// ==========================================
// 3. SIDEBAR & NAVBAR LOGIC
// ==========================================
function initSidebar() {
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownIcon = document.getElementById('dropdown-icon');

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
            if (dropdownIcon) {
                dropdownIcon.style.transform = dropdownMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    }
}

function initUserDropdown() {
    const btn = document.getElementById('user-menu-btn');
    const menu = document.getElementById('user-dropdown');
    const chevron = document.getElementById('user-chevron');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            menu.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
            menu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    });

    document.addEventListener('click', (e) => {
        if (!menu.classList.contains('hidden') && !btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    });
}

// ==========================================
// 4. PAGES LOGIC
// ==========================================

// --- DASHBOARD ---
function initDashboard() {
    const statTotal = document.getElementById('stat-total');
    if (statTotal) statTotal.textContent = mockAdmins.length;

    if (typeof Chart === 'undefined') return;

    // Revenue Chart
    const ctxRevenue = document.getElementById('revenueChart');
    if (ctxRevenue) {
        new Chart(ctxRevenue, {
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
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }
        });
    }

    // Traffic Chart
    const ctxTraffic = document.getElementById('trafficChart');
    if (ctxTraffic) {
        new Chart(ctxTraffic, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Organic'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#6366f1', '#60a5fa', '#cbd5e1'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
        });
    }
}

// --- ADD ADMIN ---
function initAddAdmin() {
    const form = document.getElementById('addAdminForm');
    const imgInput = document.getElementById('adminImage');
    const imgPreview = document.getElementById('imagePreview');
    const defaultPlaceholder = "https://ui-avatars.com/api/?name=New+User&background=cbd5e1&color=fff&size=256";

    if (imgInput && imgPreview) {
        imgInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => imgPreview.src = e.target.result;
                reader.readAsDataURL(this.files[0]);
            } else {
                imgPreview.src = defaultPlaceholder;
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const genderInput = document.querySelector('input[name="gender"]:checked');
            const gender = genderInput ? genderInput.value : null;

            const hobbies = Array.from(
                document.querySelectorAll('input[name="hobby"]:checked')
            ).map(cb => cb.value);

            const formData = new FormData();
            formData.append('fname', document.getElementById('fname').value);
            formData.append('lname', document.getElementById('lname').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('password', document.getElementById('password').value);
            formData.append('gender', gender);
            formData.append('description', document.getElementById('description').value);

            hobbies.forEach(h => formData.append('hobby', h));

            const imageInput = document.getElementById('adminImage');
            if (imageInput.files[0]) {
                formData.append('avatar', imageInput.files[0]);
            }

            const res = await fetch('/insertAdminData', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            console.log('Response from server:', data);
        });

    }
}

// --- VIEW ADMIN ---
function initViewAdmin() {
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;

    if (mockAdmins.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-500">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = mockAdmins.map(admin => `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 last:border-0" id="row-${admin.id}">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" src="${admin.image}" alt="">
                    <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900">${admin.name}</div>
                        <div class="text-sm text-slate-500">${admin.date}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600">${admin.email}</td>
            <td class="px-6 py-4 text-sm text-slate-600">${admin.gender}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${admin.hobbies.join(', ')}</td>
            <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                <button onclick="viewAdmin(${admin.id})" class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition"><i data-lucide="eye" class="w-4 h-4"></i></button>
                <button onclick="editAdmin(${admin.id})" class="text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded transition"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                <button onclick="deleteAdmin(${admin.id})" class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </td>
        </tr>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ==========================================
// 5. GLOBAL ACTIONS (View, Edit, Delete)
// ==========================================

// --- 1. VIEW ADMIN (Read Only) ---
window.viewAdmin = function (id) {
    const admin = mockAdmins.find(a => a.id === id);
    if (!admin) return;

    openModalContent(`
        <div class="text-center mb-6">
            <img src="${admin.image}" class="w-24 h-24 rounded-full mx-auto border-4 border-slate-100 shadow-sm object-cover">
            <h2 class="text-xl font-bold mt-3 text-slate-900">${admin.name}</h2>
            <p class="text-indigo-600 font-medium">${admin.email}</p>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div class="bg-slate-50 p-3 rounded"><strong>Gender:</strong> ${admin.gender}</div>
            <div class="bg-slate-50 p-3 rounded"><strong>Joined:</strong> ${admin.date}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded mb-4 text-sm">
            <strong>Hobbies:</strong> ${admin.hobbies.join(', ') || 'None'}
        </div>
        <div class="bg-slate-50 p-3 rounded mb-6 text-sm">
            <strong>Bio:</strong> <p class="mt-1 text-slate-600 italic">${admin.description || 'No description.'}</p>
        </div>
        <div class="text-center">
            <button onclick="closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium">Close</button>
        </div>
    `);
};

// --- 2. EDIT ADMIN (Full Form) ---
window.editAdmin = function (id) {
    const admin = mockAdmins.find(a => a.id === id);
    if (!admin) return;

    // Reset temporary image holder
    tempEditImage = admin.image;

    // Define Hobbies List (Must match Add Admin page options for consistency)
    const allHobbies = ['Coding', 'Design', 'Marketing', 'Reading', 'Travel', 'Gaming'];

    // Generate Checkboxes Logic
    const hobbiesHtml = allHobbies.map(hobby => {
        const isChecked = admin.hobbies.includes(hobby) ? 'checked' : '';
        return `
            <label class="inline-flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-white">
                <input type="checkbox" name="edit-hobby" value="${hobby}" ${isChecked} class="rounded text-indigo-600 focus:ring-indigo-500">
                <span class="ml-2 text-sm text-slate-600">${hobby}</span>
            </label>
        `;
    }).join('');

    // Generate Modal Content
    openModalContent(`
        <div class="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
            <h3 class="text-xl font-bold text-slate-800">Edit Admin Profile</h3>
            <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        
        <form id="editForm" onsubmit="saveEdit(event, ${id})">
            <div class="flex items-center mb-6">
                <img id="edit-preview" src="${admin.image}" class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mr-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Change Photo</label>
                    <input type="file" id="edit-image-input" onchange="previewEditImage(this)" accept="image/*" class="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"/>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                    <input type="text" id="edit-name" value="${admin.name}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                    <input type="email" id="edit-email" value="${admin.email}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                     <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">New Password</label>
                     <input type="password" id="edit-password" placeholder="Leave blank to keep" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
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
                    ${hobbiesHtml}
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Bio</label>
                <textarea id="edit-desc" rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">${admin.description || ''}</textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onclick="closeModal()" class="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition">Cancel</button>
                <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition">Save Changes</button>
            </div>
        </form>
    `);
};

// Helper: Handle Image Preview inside Edit Modal
window.previewEditImage = function (input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('edit-preview').src = e.target.result;
            tempEditImage = e.target.result; // Store new base64
        }
        reader.readAsDataURL(input.files[0]);
    }
};

// Logic: Save Edited Data
window.saveEdit = function (e, id) {
    e.preventDefault();

    // 1. Gather Data
    const newName = document.getElementById('edit-name').value;
    const newEmail = document.getElementById('edit-email').value;
    const newPass = document.getElementById('edit-password').value;
    const newDesc = document.getElementById('edit-desc').value;
    const newGender = document.querySelector('input[name="edit-gender"]:checked').value;

    // Get Checked Hobbies
    const newHobbies = Array.from(document.querySelectorAll('input[name="edit-hobby"]:checked')).map(cb => cb.value);

    // 2. Find and Update
    const index = mockAdmins.findIndex(a => a.id === id);
    if (index !== -1) {
        mockAdmins[index].name = newName;
        mockAdmins[index].email = newEmail;
        mockAdmins[index].gender = newGender;
        mockAdmins[index].description = newDesc;
        mockAdmins[index].hobbies = newHobbies;
        mockAdmins[index].image = tempEditImage; // Update image

        if (newPass) {
            console.log("Password updated for user " + id); // Mock logic
        }

        renderTable();
        closeModal();
        alert('Admin profile updated successfully!');
    }
};

// --- 3. DELETE ADMIN ---
window.deleteAdmin = function (id) {
    if (confirm('Are you sure you want to delete this admin?')) {
        const index = mockAdmins.findIndex(a => a.id === id);
        if (index > -1) {
            mockAdmins.splice(index, 1);
            renderTable();
        }
    }
};

// --- MODAL HELPERS ---
function openModalContent(html) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    if (overlay && content) {
        content.innerHTML = html;
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

window.closeModal = function () {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }
};

const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}