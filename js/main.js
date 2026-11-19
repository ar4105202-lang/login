// js/main.js
import { loadPeople, savePeople } from "./storage.js";
import { validateUser } from "./validation.js";
import { 
    showToast, showErrors, clearErrors, setEditMode, fillForm, 
    showResult, hideResult, renderStats, renderChart, renderList 
} from "./ui.js";

// ============ الحالة (State) ============
let people = loadPeople();
let editId = null;

// ============ العناصر اللي في الـ HTML ============
const form = document.getElementById("userForm");
const searchInput = document.getElementById("q");
const sortSelect = document.getElementById("so");
const cancelBtn = document.getElementById("cancelBtn");
const clearAllBtn = document.getElementById("cl");

// ============ دوال التحكم ============
function resetEditMode() {
    editId = null;
    setEditMode(false);
}

function render() {
    renderStats(people);
    renderChart(people);
    
    const q = searchInput.value.trim().toLowerCase();
    const sortBy = sortSelect.value;
    
    let visible = people.filter(function (p) {
        return !q || (p.name + " " + p.email).toLowerCase().includes(q);
    });
    
    if (sortBy === "name") visible.sort(function (a, b) { return a.name.localeCompare(b.name, "ar"); });
    else if (sortBy === "age") visible.sort(function (a, b) { return a.age - b.age; });
    else visible.sort(function (a, b) { return b.id - a.id; });

    renderList(visible, people.length, startEdit, deletePerson);
}

// ============ إرسال الفورم ============
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    // 1. التحقق باستخدام ملف validation.js
    const errors = validateUser({ name, age, email, address });
    
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        hideResult();
        return;
    }

    clearErrors();

    // 2. إنشاء المستخدم
    const user = { id: Date.now(), name: name, address: address, age: Number(age), email: email.toLowerCase() };

    if (editId) {
        user.id = editId;
        people = people.map(function (p) { return p.id === editId ? user : p; });
    } else {
        people.unshift(user);
    }

    // 3. الحفظ والعرض
    savePeople(people);
    render();
    showResult(user);
    
    form.reset();
    resetEditMode();
    
    // 4. تصفير البحث (حل مشكلة Issue رقم 5)
    searchInput.value = "";
    render(); 
});

// ============ التعديل والحذف ============
function startEdit(id) {
    const p = people.find(function (x) { return x.id === id; });
    if (!p) return;
    editId = id;
    
    fillForm(p);
    clearErrors();
    hideResult();
    setEditMode(true);
    
    form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deletePerson(id) {
    if (!confirm("هل تريد حذف هذا الشخص؟")) return;
    people = people.filter(function (p) { return p.id !== id; });
    
    if (editId === id) { 
        form.reset(); 
        resetEditMode(); 
    }
    
    savePeople(people);
    render();
    showToast("تم الحذف");
}

// ============ الأزرار ============
cancelBtn.addEventListener("click", function () {
    form.reset();
    clearErrors();
    hideResult();
    resetEditMode();
});

clearAllBtn.addEventListener("click", function () {
    if (people.length === 0) { showToast("مفيش بيانات تتمسح"); return; }
    if (!confirm("هل تريد مسح كل البيانات؟")) return;
    
    people = [];
    savePeople(people);
    form.reset();
    resetEditMode();
    render();
    showToast("تم مسح كل البيانات");
});

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

// الوضع الليلي
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
document.getElementById("th").addEventListener("click", function () {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// تشغيل أول مرة
render();
