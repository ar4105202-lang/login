// js/ui.js
const chart = document.getElementById("ch");
const list = document.getElementById("is");
const toastBox = document.getElementById("ts");
const result = document.getElementById("result");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("dd");
const cancelBtn = document.getElementById("cancelBtn");

function nf(n) { return n.toLocaleString("ar-EG"); }

function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

// ===== تنبيهات =====
let toastTimer;
export function showToast(text) {
    toastBox.textContent = text;
    toastBox.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastBox.classList.remove("on"); }, 2600);
}

// ===== الأخطاء =====
export function clearErrors() {
    ["nameError", "ageError", "emailError", "addressError"].forEach(function (id) {
        document.getElementById(id).textContent = "";
    });
}

// errors شكلها: { name: "...", email: "..." }
export function showErrors(errors) {
    clearErrors();
    Object.keys(errors).forEach(function (field) {
        document.getElementById(field + "Error").textContent = errors[field];
    });
}

// ===== الفورم =====
export function setEditMode(isEditing) {
    formTitle.textContent = isEditing ? "تعديل البيانات" : "ادخل بياناتك";
    submitBtn.textContent = isEditing ? "تحديث" : "حفظ";
    cancelBtn.hidden = !isEditing;
}

export function fillForm(p) {
    document.getElementById("name").value = p.name;
    document.getElementById("age").value = p.age;
    document.getElementById("email").value = p.email;
    document.getElementById("address").value = p.address;
}

export function showResult(user) {
    result.textContent = "";
    result.append(
        createEl("strong", "", "تم الحفظ ✅"), document.createElement("br"),
        "الاسم: " + user.name, document.createElement("br"),
        "العنوان: " + user.address, document.createElement("br"),
        "العمر: " + user.age + " سنة"
    );
    result.style.display = "block";
}

export function hideResult() {
    result.style.display = "none";
}

// ===== الإحصائيات والرسم والقائمة =====
export function renderStats(people) {
    document.getElementById("cnt").textContent = nf(people.length);
    const total = people.reduce(function (sum, p) { return sum + p.age; }, 0);
    document.getElementById("avg").textContent = nf(people.length ? Math.round(total / people.length) : 0);
    const oldest = people.reduce(function (best, p) { return !best || p.age > best.age ? p : best; }, null);
    document.getElementById("old").textContent = oldest ? oldest.name.split(" ")[0] : "—";
}

export function renderChart(people) {
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

// visible = الناس اللي هتتعرض بعد البحث والترتيب، totalCount = العدد الكلي
export function renderList(visible, totalCount, onEdit, onDelete) {
    list.textContent = "";
    if (visible.length === 0) {
        list.appendChild(createEl("li", "empty", totalCount ? "مفيش نتايج للبحث ده" : "لسه مفيش حد مسجل. املا الفورم واضغط حفظ"));
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
        editBtn.addEventListener("click", function () { onEdit(p.id); });
        deleteBtn.addEventListener("click", function () { onDelete(p.id); });

        const actions = createEl("div", "user-actions");
        actions.append(editBtn, deleteBtn);

        li.append(createEl("div", "avatar", p.name.charAt(0)), info, actions);
        list.appendChild(li);
    });
}