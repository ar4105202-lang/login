const form=document.getElementById("userForm");
const result=document.getElementById("result");
form.addEventListener("submit",function(e){
    e.preventDefault();

    const name =document.getElementById("name").value.trim();
    const age =document.getElementById("age").value.trim();
    const email =document.getElementById("email").value.trim();
    const address =document.getElementById("address").value.trim();

  document.getElementById("nameError").textContent = "";
document.getElementById("ageError").textContent = "";
document.getElementById("addressError").textContent = "";
document.getElementById("emailError").textContent = "";
      let valid = true;
 
  if (name === "") {
    document.getElementById("nameError").textContent = "من فضلك اكتب الاسم";
    valid = false;
  }
    if (!age || age < 1 || age > 120) {
    document.getElementById("ageError").textContent = "اكتب عمر صحيح (من 1 إلى 120)";
    valid = false;
  }
  if (address ===""){
    document.getElementById("addressError").textContent ="من فضلك اكتب العنوان";
    valid = false;
  }
if (email ===""){
    document.getElementById("addressError").textContent ="اكتب البريد الالكترونى";
    valid = false;
  }

  if (!valid) {
    result.style.display = "none";
    return; 
  }

   const user = { id: Date.now(), name: name, address: address, age: Number(age), email: email.toLowerCase() };

if (editId) {
    user.id = editId;   // تعديل: نستبدل الشخص القديم
    people = people.map(function (p) { return p.id === editId ? user : p; });
} else {
    people.unshift(user);   // إضافة جديد
}
savePeople();
render();

result.innerHTML = "<strong>تم الحفظ ✅</strong><br>" + "الاسم: " + user.name + "<br>" + "العنوان: " + user.address + "<br>" + "العمر: " + user.age + " سنة";
result.style.display = "block";
form.reset();
resetEditMode();
});// ============ جديد: البيانات والعناصر ============
let people = JSON.parse(localStorage.getItem("people")) || [];
let editId = null;   // لو فيه رقم يبقى بنعدّل، ولو null يبقى بنضيف جديد

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("dd");
const cancelBtn = document.getElementById("cancelBtn");
const list = document.getElementById("is");
const chart = document.getElementById("ch");
const searchInput = document.getElementById("q");
const sortSelect = document.getElementById("so");
const toastBox = document.getElementById("ts");

function savePeople() {
    localStorage.setItem("people", JSON.stringify(people));
}
function nf(n) { return n.toLocaleString("ar-EG"); }   // 21 تبقى ٢١

// بتعمل عنصر HTML بسطر واحد: النوع، الكلاس، الكلام اللي جواه
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

let toastTimer;
function showToast(text) {
    toastBox.textContent = text;
    toastBox.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastBox.classList.remove("on"); }, 2600);
}

function clearErrors() {
    ["nameError", "ageError", "emailError", "addressError"].forEach(function (id) {
        document.getElementById(id).textContent = "";
    });
}

function resetEditMode() {
    editId = null;
    formTitle.textContent = "ادخل بياناتك";
    submitBtn.textContent = "حفظ";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", function () {
    form.reset();
    clearErrors();
    resetEditMode();
});

// ============ تعديل وحذف ============
function startEdit(id) {
    const p = people.find(function (x) { return x.id === id; });
    if (!p) return;
    editId = id;
    document.getElementById("name").value = p.name;
    document.getElementById("age").value = p.age;
    document.getElementById("email").value = p.email;
    document.getElementById("address").value = p.address;
    clearErrors();
    result.style.display = "none";
    formTitle.textContent = "تعديل البيانات";
    submitBtn.textContent = "تحديث";
    cancelBtn.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deletePerson(id) {
    if (!confirm("هل تريد حذف هذا الشخص؟")) return;
    people = people.filter(function (p) { return p.id !== id; });
    if (editId === id) { form.reset(); resetEditMode(); }
    savePeople();
    render();
    showToast("تم الحذف");
}

document.getElementById("cl").addEventListener("click", function () {
    if (people.length === 0) { showToast("مفيش بيانات تتمسح"); return; }
    if (!confirm("هل تريد مسح كل البيانات؟")) return;
    people = [];
    savePeople();
    form.reset();
    resetEditMode();
    render();
    showToast("تم مسح كل البيانات");
});

// ============ رسم الأرقام والأشرطة والقايمة ============
function renderStats() {
    document.getElementById("cnt").textContent = nf(people.length);
    const total = people.reduce(function (sum, p) { return sum + p.age; }, 0);
    document.getElementById("avg").textContent = nf(people.length ? Math.round(total / people.length) : 0);
    const oldest = people.reduce(function (best, p) { return !best || p.age > best.age ? p : best; }, null);
    document.getElementById("old").textContent = oldest ? oldest.name.split(" ")[0] : "—";
}

function renderChart() {
    const groups = [
        { label: "أقل من ١٨", count: 0 },
        { label: "١٨ – ٢٥", count: 0 },
        { label: "٢٦ – ٤٠", count: 0 },
        { label: "أكبر من ٤٠", count: 0 }
    ];
    people.forEach(function (p) {
        const i = p.age < 18 ? 0 : p.age <= 25 ? 1 : p.age <= 40 ? 2 : 3;
        groups[i].count++;
    });
    const max = Math.max(1, ...groups.map(function (g) { return g.count; }));
    chart.textContent = "";
    groups.forEach(function (g) {
        const row = createEl("div", "bar-row");
        const track = createEl("div", "progress-track");
        const fill = createEl("div", "progress-fill");
        fill.style.width = (g.count / max) * 100 + "%";
        track.appendChild(fill);
        row.append(createEl("span", "bar-label", g.label), track, createEl("span", "bar-count", nf(g.count)));
        chart.appendChild(row);
    });
}

function getVisiblePeople() {
    const q = searchInput.value.trim().toLowerCase();
    const sortBy = sortSelect.value;
    const visible = people.filter(function (p) {
        return !q || (p.name + " " + p.email).toLowerCase().includes(q);
    });
    if (sortBy === "name") visible.sort(function (a, b) { return a.name.localeCompare(b.name, "ar"); });
    else if (sortBy === "age") visible.sort(function (a, b) { return a.age - b.age; });
    else visible.sort(function (a, b) { return b.id - a.id; });   // الأحدث أولا
    return visible;
}

function renderList() {
    list.textContent = "";
    const visible = getVisiblePeople();
    if (visible.length === 0) {
        list.appendChild(createEl("li", "empty", people.length ? "مفيش نتايج للبحث ده" : "لسه مفيش حد مسجل. املا الفورم واضغط حفظ"));
        return;
    }
    visible.forEach(function (p) {
        const li = createEl("li", "user-item");

        const info = createEl("div", "user-info");
        info.append(createEl("h4", "", p.name), createEl("p", "", p.email), createEl("p", "", nf(p.age) + " سنة، " + p.address));

        const editBtn = createEl("button", "btn-edit", "تعديل");
        const deleteBtn = createEl("button", "btn-delete", "حذف");
        editBtn.type = "button";
        deleteBtn.type = "button";
        editBtn.addEventListener("click", function () { startEdit(p.id); });
        deleteBtn.addEventListener("click", function () { deletePerson(p.id); });

        const actions = createEl("div", "user-actions");
        actions.append(editBtn, deleteBtn);

        li.append(createEl("div", "avatar", p.name.charAt(0)), info, actions);
        list.appendChild(li);
    });
}

function render() {
    renderStats();
    renderChart();
    renderList();
}

searchInput.addEventListener("input", renderList);
sortSelect.addEventListener("change", renderList);

// ============ الوضع الليلي ============
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
document.getElementById("th").addEventListener("click", function () {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

render();   // أول ما الصفحة تفتح
