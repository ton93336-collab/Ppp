// ================= 1. ระบบเปลี่ยนหน้า (SPA) =================
function switchPage(pageId, btnElement) {
    // ซ่อนทุกหน้า
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        setTimeout(() => page.classList.add('hidden'), 50);
    });
    // ลบสีปุ่มที่เคยเลือก
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // โชว์หน้าที่กด
    const target = document.getElementById(pageId);
    target.classList.remove('hidden');
    setTimeout(() => target.classList.add('active'), 50);
    
    // ไฮไลต์ปุ่มที่กด
    btnElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= 2. ระบบ Popup (Modals) =================
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Modal เล็กดูตัวอย่างลิงก์
function openLinkModal(title, url) {
    document.getElementById('modal-link-title').innerText = "ดูตัวอย่าง: " + title;
    document.getElementById('modal-link-url').href = url;
    document.getElementById('modal-link').classList.remove('hidden');
}

// Modal ขยายรูปใหญ่
function openImageModal(imgSrc) {
    document.getElementById('modal-img-display').src = imgSrc;
    document.getElementById('modal-image').classList.remove('hidden');
}

// ================= 3. ระบบ Admin (เปลี่ยนรูป & แก้ข้อความ) =================
const ADMIN_PASSWORD = "ss11";
let currentImageId = null;

function openAdminModal() {
    if (document.body.classList.contains('admin-mode')) {
        if(confirm("ต้องการออกจากโหมดจัดการร้านใช่ไหม?")) {
            document.body.classList.remove('admin-mode');
            // ปิดแก้ไขข้อความ
            document.querySelectorAll('.edit-text').forEach(el => el.setAttribute('contenteditable', 'false'));
            alert("ออกจากระบบแอดมินเรียบร้อยค่ะ 🌸");
        }
        return;
    }
    document.getElementById('admin-error').classList.add('hidden');
    document.getElementById('admin-pass').value = '';
    document.getElementById('modal-admin').classList.remove('hidden');
}

function checkAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === ADMIN_PASSWORD) {
        document.body.classList.add('admin-mode');
        closeModal('modal-admin');
        
        // เปิดให้แก้ข้อความหัวชื่องานได้
        document.querySelectorAll('.edit-text').forEach(el => {
            el.setAttribute('contenteditable', 'true');
            // เซฟข้อความอัตโนมัติเมื่อพิมพ์เสร็จ
            el.addEventListener('blur', function() {
                // สร้าง ID ให้มันถ้ายังไม่มี เพื่อเซฟลง LocalStorage
                if(!this.id) this.id = 'txt-' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem(this.id, this.innerText);
            });
        });

        alert("เข้าสู่ระบบสำเร็จ! ✨\n- กดที่รูป 📸 มุมขวาเพื่อเปลี่ยนรูป\n- กดที่ชื่องานเพื่อพิมพ์แก้ชื่อได้เลยค่ะ");
    } else {
        document.getElementById('admin-error').classList.remove('hidden');
    }
}

// เมื่อแอดมินกดไอคอนกล้อง
function triggerUpload(imgId) {
    currentImageId = imgId;
    document.getElementById('file-uploader').click();
}

// เมื่อเลือกรูปจากคลังภาพ
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && currentImageId) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            // เปลี่ยนรูปในหน้าเว็บ
            document.getElementById(currentImageId).src = dataUrl;
            // บันทึกลง LocalStorage
            localStorage.setItem(currentImageId, dataUrl);
        }
        reader.readAsDataURL(file);
    }
}

// ================= 4. โหลดข้อมูลที่บันทึกไว้เมื่อเปิดเว็บ =================
window.onload = function() {
    // โหลดรูปภาพ
    const images = document.querySelectorAll('img[id]');
    images.forEach(img => {
        const savedImg = localStorage.getItem(img.id);
        if (savedImg) img.src = savedImg;
    });

    // โหลดข้อความชื่องาน (ถ้ามีการแก้)
    const textElements = document.querySelectorAll('.edit-text');
    textElements.forEach(el => {
        if(el.id) {
            const savedText = localStorage.getItem(el.id);
            if(savedText) el.innerText = savedText;
        }
    });
}
