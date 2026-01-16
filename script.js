let isDarkMode = false;
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-btn');
    btn.innerText = isDarkMode ? "🌙 ليلي" : "☀️ نهاري";
}

// === القوائم والتنقل ===
const menus = [
    { id: 'home', text: '🏠 الرئيسية' },
    { id: 'student', text: '📖 ركن الطالب' },
    { id: 'ranks', text: '🏆 الأوائل' },
    { id: 'schedule', text: '📅 الجداول' },
    { id: 'teachers', text: '👨‍🏫 المعلمون' },
    { id: 'about', text: 'ℹ️ من نحن' },
    { id: 'mobile', text: '📱 الجوال' }
];

const navContainer = document.getElementById('nav-buttons');
menus.forEach(menu => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn'; btn.innerText = menu.text;
    btn.onclick = () => {
        document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${menu.id}`).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // تحميل المصحف عند دخول قسم الطالب
        if(menu.id === 'student' && !window.quranData) loadQuranData();
    };
    navContainer.appendChild(btn);
});
navContainer.firstChild.classList.add('active');


// === محرك المصحف الأساسي ===
window.quranData = null; 
window.quranArray = [];  

function loadQuranData() {
    fetch('quran.json') 
        .then(r => r.json())
        .then(data => {
            document.getElementById('quran-loader').style.display = 'none';
            window.quranData = data;
            window.quranArray = Object.values(data);
            prepareSearchData(); 
            renderSurahList(window.quranArray);
        })
        .catch(err => {
            console.error(err);
            document.getElementById('quran-loader').innerHTML = "لم يتم العثور على ملف quran.json";
        });
}

function normalizeText(text) {
    return text.replace(/[\u064B-\u065F\u0670]/g, '').replace(/[ٱإأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
}

function prepareSearchData() {
    window.quranArray.forEach(surah => {
        surah.ayahs.forEach(ayah => {
            ayah.simpleText = normalizeText(ayah.text);
        });
    });
}

function renderSurahList(list) {
    const container = document.getElementById('surah-list-container');
    container.innerHTML = '';
    list.forEach(surah => {
        const item = document.createElement('div');
        item.className = 'surah-list-item';
        item.innerHTML = `<div style="display:flex; align-items:center; gap:10px;"><div class="surah-number-badge">${surah.num || surah.number}</div><strong>سورة ${surah.name}</strong></div><span style="font-size:0.8rem; color:#666">${surah.ayahCount || surah.numberOfAyahs} آية</span>`;
        item.onclick = () => openSurah(surah);
        container.appendChild(item);
    });
}

function openSurah(surah) {
    document.getElementById('surah-list-view').style.display = 'none';
    document.getElementById('surah-reader-view').style.display = 'block';
    const reader = document.getElementById('reader-content');
    let basmalaHTML = (surah.num != 9 && surah.num != 1) ? '<div class="basmala">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>' : '';
    let ayahsHTML = surah.ayahs.map(ayah => `<span class="ayah-span">${ayah.text} <span class="ayah-number-symbol">(${ayah.num})</span> </span>`).join('');
    reader.innerHTML = `<div class="surah-header"><h2>سورة ${surah.name}</h2><p>${surah.type || ''}</p></div>${basmalaHTML}<div class="ayah-container">${ayahsHTML}</div>`;
    window.scrollTo(0,0);
}

function backToSurahList() {
    document.getElementById('surah-reader-view').style.display = 'none';
    document.getElementById('surah-list-view').style.display = 'block';
}

function searchQuran() {
    const query = normalizeText(document.getElementById('quran-search').value);
    if (!query) { renderSurahList(window.quranArray); return; }
    let results = window.quranArray.filter(s => normalizeText(s.name).includes(query));
    if (results.length === 0 && query.length > 2) {
        results = window.quranArray.filter(surah => surah.ayahs.some(ayah => ayah.simpleText.includes(query)));
    }
    renderSurahList(results);
}

function openQuranTab(tabName) {
    document.querySelectorAll('.quran-content-section').forEach(d => d.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.querySelectorAll('.quran-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

// === القوائم المنسدلة والحاسبات ===
const acc = document.getElementsByClassName("accordion-btn");
for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active-acc");
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) { panel.style.maxHeight = null; } 
        else { panel.style.maxHeight = panel.scrollHeight + 500 + "px"; }
    });
}

function populateSelect(id, min, max, labelSuffix) {
    const select = document.getElementById(id);
    let optionZero = document.createElement("option"); optionZero.value = 0; optionZero.text = "0 " + labelSuffix; select.appendChild(optionZero);
    for(let i=min; i<=max; i++) { if(i===0) continue; let option = document.createElement("option"); option.value = i; option.text = i + " " + labelSuffix; select.appendChild(option); }
}
populateSelect("target-days", 1, 30, "يوم");
populateSelect("target-months", 1, 12, "شهر");
populateSelect("target-years", 1, 10, "سنة");
const skipSelect = document.getElementById("skipped-parts");
for(let i=1; i<=29; i++) { let option = document.createElement("option"); option.value = i; option.text = i + " جزء"; skipSelect.appendChild(option); }

let selectedDays = 0;
const daysOptionsDiv = document.getElementById('days-options');
[{v: 1, t: "يوم واحد"}, {v: 2, t: "يومان"}, {v: 3, t: "3 أيام"}, {v: 4, t: "4 أيام"}, {v: 5, t: "5 أيام"}, {v: 6, t: "6 أيام"}, {v: 7, t: "يومياً"}].forEach(d => {
    const btn = document.createElement('button'); btn.className = 'calc-btn'; btn.innerText = d.t;
    btn.onclick = () => { selectedDays = d.v; document.getElementById('calc-step-1').style.display = 'none'; document.getElementById('calc-step-2').style.display = 'block'; };
    daysOptionsDiv.appendChild(btn);
});

const amountOptionsDiv = document.getElementById('amount-options');
[{v: 0.5, t: "نصف صفحة"}, {v: 1, t: "صفحة واحدة"}, {v: 2, t: "صفحتان"}, {v: 3, t: "3 صفحات"}, {v: 20, t: "جزء كامل"}].forEach(a => {
    const btn = document.createElement('button'); btn.className = 'calc-btn'; btn.innerText = a.t;
    btn.onclick = () => calculatePlan(a.v);
    amountOptionsDiv.appendChild(btn);
});

const customBtn = document.createElement('button'); customBtn.className = 'calc-btn'; customBtn.innerText = "✏️ رقم آخر";
customBtn.onclick = () => { document.getElementById('custom-amount-div').style.display = 'block'; };
amountOptionsDiv.appendChild(customBtn);

function calculatePlan(pagesPerDay) {
    pagesPerDay = parseFloat(pagesPerDay);
    if(!pagesPerDay || pagesPerDay <= 0) return alert("الرجاء إدخال رقم صحيح");
    const totalPages = 604;
    const weeklyPages = selectedDays * pagesPerDay;
    const weeksNeeded = totalPages / weeklyPages;
    const totalDaysNeeded = Math.ceil(weeksNeeded * 7);
    let durationText = "";
    if (totalDaysNeeded < 30) durationText = `${totalDaysNeeded} يوم`;
    else if (totalDaysNeeded < 365) durationText = `${Math.floor(totalDaysNeeded / 30)} شهر و ${totalDaysNeeded % 30} يوم`;
    else durationText = `${Math.floor(totalDaysNeeded / 365)} سنة و ${Math.floor((totalDaysNeeded % 365) / 30)} شهر`;

    const resultDiv = document.getElementById('calc-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<h3>🎉 النتيجة المتوقعة</h3><p>معدل الحفظ الأسبوعي: <strong>${weeklyPages} صفحات</strong></p><p style="font-size:1.2rem; color:var(--primary-color); font-weight:bold;">ستختم خلال:<br>⏳ ${durationText}</p>`;
    document.getElementById('calc-step-2').style.display = 'none'; document.getElementById('reset-calc').style.display = 'block';
}

function resetCalc() {
    selectedDays = 0; document.getElementById('calc-result').style.display = 'none'; document.getElementById('reset-calc').style.display = 'none';
    document.getElementById('calc-step-2').style.display = 'none'; document.getElementById('custom-amount-div').style.display = 'none';
    document.getElementById('calc-step-1').style.display = 'block'; document.getElementById('custom-pages').value = '';
}

function calculateReversePlan() {
    const days = parseInt(document.getElementById('target-days').value) || 0;
    const months = parseInt(document.getElementById('target-months').value) || 0;
    const years = parseInt(document.getElementById('target-years').value) || 0;
    const skipped = parseInt(document.getElementById('skipped-parts').value) || 0;
    const planType = document.querySelector('input[name="planType"]:checked').value;
    const totalDaysAvailable = days + (months * 30) + (years * 365);
    if (totalDaysAvailable === 0) { alert("يرجى اختيار مدة زمنية ⚠️"); return; }
    const remainingParts = 30 - skipped;
    const totalPages = remainingParts * 20;
    const dailyPages = totalPages / totalDaysAvailable;
    let amountText = "";
    if(dailyPages >= 20) amountText = `<strong>${(dailyPages/20).toFixed(1)} جزء</strong> يومياً`;
    else if (dailyPages >= 1) amountText = `<strong>${Math.ceil(dailyPages)} صفحات</strong> يومياً`;
    else amountText = `<strong>${Math.ceil(dailyPages * 15)} أسطر</strong> يومياً`;
    const resultDiv = document.getElementById('reverse-calc-result');
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `<h3>🎯 خطتك المقترحة</h3><p>المطلوب منك (${planType}) بمعدل:</p><div style="font-size:1.5rem; color:var(--primary-color); margin:10px 0;">${amountText}</div>`;
}

// === البيانات العامة ===
const siteData = {
    news: [{id:1, date:"15-1", text:"تكريم المتميزين", winners:["أحمد", "محمد", "سعيد"]}],
    ranks: [{ring:"حلقة عمر", students:["خالد", "ياسين"]}, {ring:"حلقة أبو بكر", students:["سعد", "عبدالله"]}],
    teachers: [{name:"الشيخ عبدالله", job:"مشرف عام"}],
    afternoon: [{name:"عمر بن الخطاب", time:"4:00 - 5:00"}],
    evening: [{name:"أبو بكر", time:"بعد المغرب"}]
};

siteData.news.forEach(n => document.getElementById('news-list').innerHTML += `<div class="card clickable" onclick="toggleWinners(${n.id})"><strong>📅 ${n.date}</strong><br>${n.text}${n.winners.length > 0 ? `<div id="win-${n.id}" class="winner-list">الفائزون: ${n.winners.join(' - ')}</div>` : ''}</div>`);
function toggleWinners(id) { const el = document.getElementById(`win-${id}`); if(el) el.style.display = (el.style.display === 'block') ? 'none' : 'block'; }
siteData.ranks.forEach(r => { let list = r.students.map(s=>`<li>${s}</li>`).join(''); document.getElementById('ranks-list').innerHTML += `<div class="card" style="border-right:4px solid var(--accent-color)"><strong>${r.ring}</strong><ul>${list}</ul></div>`; });
function createTable(name, time) { document.getElementById('schedule-display').innerHTML = `<h3>${name}</h3><table><tr><td>اليوم</td><td>${time}</td><td>حفظ ومراجعة</td></tr></table>`; }
siteData.afternoon.forEach(r => { const b = document.createElement('button'); b.className='nav-btn'; b.innerText=r.name; b.onclick=()=>createTable(r.name, r.time); document.getElementById('ring-selectors-afternoon').appendChild(b); });
siteData.evening.forEach(r => { const b = document.createElement('button'); b.className='nav-btn'; b.innerText=r.name; b.onclick=()=>createTable(r.name, r.time); document.getElementById('ring-selectors-evening').appendChild(b); });
siteData.teachers.forEach(t => document.getElementById('teachers-list').innerHTML += `<div class="card"><strong>${t.name}</strong><br>${t.job}</div>`);

const verses = ["﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾", "﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾"];
const vDisplay = document.getElementById('verse-display');
function showV() { vDisplay.innerText = verses[Math.floor(Math.random()*verses.length)]; vDisplay.classList.add('visible'); setTimeout(()=>vDisplay.classList.remove('visible'),8000); }
showV(); setInterval(showV, 38000);


// ==========================================
// 🧠 نظام الاختبار الذكي (الكود الجديد الذي كان ناقصاً)
// ==========================================

const JUZ_START = {
    1: [1,1], 2: [2,142], 3: [2,253], 4: [3,93], 5: [4,24], 6: [4,148],
    7: [5,82], 8: [6,111], 9: [7,88], 10: [8,41], 11: [9,93], 12: [11,6],
    13: [12,53], 14: [15,1], 15: [17,1], 16: [18,75], 17: [21,1], 18: [23,1],
    19: [25,21], 20: [27,56], 21: [29,46], 22: [33,31], 23: [36,28], 24: [39,32],
    25: [41,47], 26: [46,1], 27: [51,31], 28: [58,1], 29: [67,1], 30: [78,1]
};

let currentQuizAnswer = {}; 

function initQuiz() {
    const juzSelect = document.getElementById('quiz-juz');
    if(!juzSelect) return; 
    juzSelect.innerHTML = '<option value="0">-- اختر الجزء --</option>';
    for(let i=1; i<=30; i++) {
        let op = document.createElement('option');
        op.value = i;
        op.innerText = `الجزء ${i}`;
        juzSelect.appendChild(op);
    }
}
setTimeout(initQuiz, 1000); // تشغيل التهيئة تلقائياً

function updateQuizSurahs() {
    if (!window.quranData) {
        alert("يرجى الانتظار، جاري تحميل المصحف...");
        loadQuranData(); 
        return;
    }
    const juz = parseInt(document.getElementById('quiz-juz').value);
    const surahSelect = document.getElementById('quiz-surah');
    surahSelect.innerHTML = '<option value="0">كل سور الجزء</option>';
    if (juz === 0) return;
    let startSurah = JUZ_START[juz][0];
    let endSurah = (juz === 30) ? 114 : JUZ_START[juz+1][0];
    for(let i = startSurah; i <= endSurah; i++) {
        let s = window.quranData[i];
        if(s) {
            let op = document.createElement('option'); op.value = i; op.innerText = `${i}. سورة ${s.name}`; surahSelect.appendChild(op);
        }
    }
}

function generateQuestion() {
    if (!window.quranData) { alert("تأكد من تحميل المصحف أولاً (افتح تبويب المصحف مرة واحدة)"); return; }
    const juz = parseInt(document.getElementById('quiz-juz').value);
    const targetSurah = parseInt(document.getElementById('quiz-surah').value);
    const type = document.getElementById('quiz-type').value;
    if (juz === 0) { alert("الرجاء اختيار الجزء أولاً"); return; }
    let candidates = [];
    let startS = JUZ_START[juz][0]; let startA = JUZ_START[juz][1];
    let endS = (juz === 30) ? 114 : JUZ_START[juz+1][0];
    if (targetSurah !== 0) { startS = targetSurah; endS = targetSurah; startA = 1; }
    for (let s = startS; s <= endS; s++) {
        let surahObj = window.quranData[s];
        if (!surahObj) continue;
        surahObj.ayahs.forEach(ay => {
            if (s === JUZ_START[juz][0] && ay.num < JUZ_START[juz][1]) return;
            if (juz < 30 && s === JUZ_START[juz+1][0] && ay.num >= JUZ_START[juz+1][1]) return;
            candidates.push({
                surahName: surahObj.name, surahNum: s, ayahNum: ay.num, text: ay.text,
                nextAyah: surahObj.ayahs.find(a => a.num === ay.num + 1)?.text || "نهاية السورة"
            });
        });
    }
    if (candidates.length === 0) { alert("حدث خطأ في تحديد الآيات"); return; }
    let randomAyah = candidates[Math.floor(Math.random() * candidates.length)];
    let qText = ""; let aText = ""; let details = `سورة ${randomAyah.surahName} - آية ${randomAyah.ayahNum}`;
    if (type === 'complete') { qText = `أكمل الآية التي تلي:<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`; aText = randomAyah.nextAyah; } 
    else if (type === 'surah_name') { qText = `هذه الآية في أي سورة؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`; aText = `سورة ${randomAyah.surahName}`; } 
    else if (type === 'ayah_num') { qText = `ما هو رقم هذه الآية؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`; aText = `الآية رقم ${randomAyah.ayahNum}`; } 
    else if (type === 'which_juz') { qText = `في أي جزء تقع هذه الآية؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span> <br> <small>(سورة ${randomAyah.surahName})</small>`; aText = `الجزء ${juz}`; }
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('question-text').innerHTML = qText;
    document.getElementById('answer-box').style.display = 'none';
    document.getElementById('show-answer-btn').style.display = 'inline-block';
    currentQuizAnswer = { main: aText, det: details };
}

function showAnswer() {
    document.getElementById('show-answer-btn').style.display = 'none';
    document.getElementById('answer-box').style.display = 'block';
    document.getElementById('answer-text').innerHTML = currentQuizAnswer.main;
    document.getElementById('answer-details').innerText = currentQuizAnswer.det;
}
