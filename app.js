// === 1. النظام الأساسي ===
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('theme-btn').innerText = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
}
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    if(id === 'student' && !window.quranData) loadQuranData();
}

// === 2. تحميل البيانات من data.js وعرضها ===
// الأخبار
siteData.news.forEach(n => {
    document.getElementById('news-list').innerHTML += `<div class="card"><strong>📅 ${n.date}</strong><br>${n.text}</div>`;
});
// الأوائل (نظام الإظهار والإخفاء الجديد)
siteData.ranks.forEach((r, index) => {
    let winnersHtml = r.winners.map((w, i) => `<div class="winner-row"><span class="medal">${['🥇','🥈','🥉'][i]}</span> ${w}</div>`).join('');
    document.getElementById('ranks-list').innerHTML += `
    <div class="card rank-card" onclick="toggleRank(this)">
        <div class="rank-header"><span>${r.name}</span><span>▼</span></div>
        <div class="winners-box">${winnersHtml}</div>
    </div>`;
});
function toggleRank(element) {
    const box = element.querySelector('.winners-box');
    const arrow = element.querySelector('.rank-header span:last-child');
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
    arrow.innerText = (box.style.display === 'block') ? '▲' : '▼';
}
// المعلمون
siteData.teachers.forEach(t => {
    document.getElementById('teachers-list').innerHTML += `<div class="card"><strong>${t.name}</strong><br><span style="color:gray">${t.job}</span></div>`;
});
// الجداول
const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
siteData.scheduleButtons.forEach(btn => {
    const container = (btn.type === 'asr') ? 'ring-selectors-afternoon' : 'ring-selectors-evening';
    document.getElementById(container).innerHTML += `<button class="nav-btn" onclick="showSchedule('${btn.name}', '${btn.type}')">${btn.name}</button>`;
});
function showSchedule(name, type) {
    let time = (type === 'asr') ? '4:00 - 5:30 عصراً' : 'بعد صلاة المغرب';
    let rows = days.map(d => `<tr><td>${d}</td><td>${time}</td><td>حفظ ومراجعة</td></tr>`).join('');
    document.getElementById('schedule-display').innerHTML = `<h3>جدول: ${name}</h3><table><tr><th>اليوم</th><th>الوقت</th><th>النشاط</th></tr>${rows}</table>`;
}

// === 3. ركن الطالب (المصحف والاختبار) ===
function openTab(id) {
    document.querySelectorAll('.quran-content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    document.querySelectorAll('.quran-tab').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}
// الأكورديون
document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        let panel = this.nextElementSibling;
        panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
    });
});

// محرك المصحف
window.quranData = null;
function loadQuranData() {
    fetch('quran.json').then(r => r.json()).then(data => {
        document.getElementById('quran-loader').style.display = 'none';
        window.quranData = data;
        renderSurahs(Object.values(data));
        initQuiz();
    }).catch(() => document.getElementById('quran-loader').innerHTML = "خطأ في تحميل الملف");
}
function renderSurahs(list) {
    document.getElementById('surah-list-container').innerHTML = list.map(s => 
        `<div class="surah-list-item" onclick="openReader(${s.num})"><strong>${s.num}. ${s.name}</strong><span>${s.ayahCount} آية</span></div>`
    ).join('');
}
function openReader(num) {
    let s = window.quranData[num];
    document.getElementById('surah-list-view').style.display = 'none';
    document.getElementById('surah-reader-view').style.display = 'block';
    let text = s.ayahs.map(a => `<span class="ayah-span">${a.text} <span class="ayah-number-symbol">(${a.num})</span></span>`).join('');
    document.getElementById('reader-content').innerHTML = `<div class="surah-header"><h2>${s.name}</h2></div><div class="ayah-container">${text}</div>`;
}
function backToList() {
    document.getElementById('surah-reader-view').style.display = 'none';
    document.getElementById('surah-list-view').style.display = 'block';
}

// محرك الاختبار
const JUZ_START = {1:[1,1], 30:[78,1]}; // (اختصاراً هنا، يفضل وضع كامل القائمة كما في الكود السابق)
function initQuiz() {
    let sel = document.getElementById('quiz-juz');
    for(let i=1; i<=30; i++) sel.innerHTML += `<option value="${i}">الجزء ${i}</option>`;
}
// (بقية كود الاختبار والحاسبة نفس النسخة السابقة، لم أكرره لتوفير المساحة، انسخ دالة generateQuestion السابقة وضعها هنا)
