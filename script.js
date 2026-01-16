let isDarkMode = false;
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-btn');
    btn.innerText = isDarkMode ? "🌙 ليلي" : "☀️ نهاري";
}

// === تفعيل القوائم المنسدلة (Accordions) ===
const acc = document.getElementsByClassName("accordion-btn");
for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active-acc");
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

// === تعبئة قوائم الاختيار لدليل الختم ===
function populateSelect(id, min, max, labelSuffix) {
    const select = document.getElementById(id);
    let optionZero = document.createElement("option");
    optionZero.value = 0;
    optionZero.text = "0 " + labelSuffix;
    select.appendChild(optionZero);

    for(let i=min; i<=max; i++) {
        if(i===0) continue;
        let option = document.createElement("option");
        option.value = i;
        option.text = i + " " + labelSuffix;
        select.appendChild(option);
    }
}
populateSelect("target-days", 1, 30, "يوم");
populateSelect("target-months", 1, 12, "شهر");
populateSelect("target-years", 1, 10, "سنة");

const skipSelect = document.getElementById("skipped-parts");
for(let i=1; i<=29; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i + " جزء";
    skipSelect.appendChild(option);
}

// === منطق حاسبة "دليل الختم" ===
function calculateReversePlan() {
    const days = parseInt(document.getElementById('target-days').value) || 0;
    const months = parseInt(document.getElementById('target-months').value) || 0;
    const years = parseInt(document.getElementById('target-years').value) || 0;
    const skipped = parseInt(document.getElementById('skipped-parts').value) || 0;
    
    const planType = document.querySelector('input[name="planType"]:checked').value;

    const totalDaysAvailable = days + (months * 30) + (years * 365);
    
    if (totalDaysAvailable === 0) {
        alert("يرجى اختيار مدة زمنية (أيام، أشهر، أو سنوات) ⚠️");
        return;
    }

    const remainingParts = 30 - skipped;
    const totalPages = remainingParts * 20;
    
    const dailyPages = totalPages / totalDaysAvailable;

    let resultText = "";
    let amountText = "";

    if(dailyPages >= 20) {
        amountText = `<strong>${(dailyPages/20).toFixed(1)} جزء</strong> يومياً`;
    } else if (dailyPages >= 1) {
        amountText = `<strong>${Math.ceil(dailyPages)} صفحات</strong> يومياً`;
    } else {
        const lines = Math.ceil(dailyPages * 15);
        amountText = `<strong>${lines} أسطر</strong> يومياً`;
    }

    const resultDiv = document.getElementById('reverse-calc-result');
    resultDiv.style.display = "block";
    
    const panel = resultDiv.closest('.accordion-panel');
    panel.style.maxHeight = panel.scrollHeight + 500 + "px"; 

    resultDiv.innerHTML = `
        <h3>🎯 خطتك المقترحة</h3>
        <p>بناءً على اختياراتك لختم القرآن خلال 
        ${years > 0 ? years + ' سنة ' : ''}
        ${months > 0 ? months + ' شهر ' : ''}
        ${days > 0 ? days + ' يوم ' : ''}
        </p>
        <p>مع تخطي <strong>${skipped} أجزاء</strong> سابقة.</p>
        <hr style="border-color:var(--accent-color); opacity:0.3">
        <p style="font-size:1.1rem;">المطلوب منك (${planType}) بمعدل:</p>
        <div style="font-size:1.5rem; color:var(--primary-color); margin:10px 0;">${amountText}</div>
        <p style="font-size:0.9rem; color:#555; margin-top:15px;">
            <span class="quran-verse" style="font-size:1.1rem">﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾</span>
            <br>نسأل الله أن يبارك في وقتك ويثبتك.
        </p>
    `;
}

// === بيانات الموقع ===
const siteData = {
    news: [
        { id: 1, date: "15-1", text: "تم تكريم الطلاب المتميزين (اضغط لرؤية الأسماء)", winners: ["سعيد أحمد", "محمد فؤاد", "يوسف عمر"] },
        { id: 2, date: "12-1", text: "بداية التسجيل للدورة الصيفية.", winners: [] }
    ],
    ranks: [
        { ring: "حلقة عمر بن الخطاب", students: ["خالد أحمد", "ياسين عمر", "فهد محمد"] },
        { ring: "حلقة أبو بكر الصديق", students: ["سعد إبراهيم", "عبدالله علي", "عثمان حسن"] },
        { ring: "حلقة عثمان بن عفان", students: ["بدر ناصر", "ريان يوسف", "زياد فؤاد"] },
        { ring: "حلقة علي بن أبي طالب", students: ["حمزة صالح", "أنس محمود", "طلال بكر"] },
        { ring: "حلقة الزبير بن العوام", students: ["معاذ إياد", "تميم منصور", "يحيى زكريا"] }
    ],
    teachers: [
        { name: "الشيخ عبدالله", job: "المشرف العام" },
        { name: "أ. أحمد محمد", job: "حلقة أبو بكر" },
        { name: "أ. سعيد عمر", job: "حلقة عمر بن الخطاب" }
    ],
    afternoonRings: [ { name: "حلقة عمر بن الخطاب", time: "4:00 - 5:00 عصراً" } ],
    eveningRings: [
        { name: "حلقة أبو بكر الصديق", time: "بعد المغرب" },
        { name: "حلقة عثمان بن عفان", time: "بعد المغرب" },
        { name: "حلقة علي بن أبي طالب", time: "بعد المغرب" },
        { name: "حلقة الزبير بن العوام", time: "بعد المغرب" }
    ]
};

const menus = [
    { id: 'home', text: '🏠 الرئيسية' },
    { id: 'ranks', text: '🏆 الأوائل' },
    { id: 'schedule', text: '📅 الجداول' },
    { id: 'student', text: '📖 ركن الطالب' },
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
    };
    navContainer.appendChild(btn);
});
navContainer.firstChild.classList.add('active');

// === منطق حاسبة الختم الأولى (خطة ختمي) ===
let selectedDays = 0;
const daysOptionsDiv = document.getElementById('days-options');
const daysList = [{v: 1, t: "يوم واحد"}, {v: 2, t: "يومان"}, {v: 3, t: "3 أيام"}, {v: 4, t: "4 أيام"}, {v: 5, t: "5 أيام"}, {v: 6, t: "6 أيام"}, {v: 7, t: "يومياً (7 أيام)"}];
daysList.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'calc-btn'; btn.innerText = d.t;
    btn.onclick = () => {
        selectedDays = d.v;
        document.getElementById('calc-step-1').style.display = 'none';
        document.getElementById('calc-step-2').style.display = 'block';
        const panel = document.getElementById('calc-step-2').closest('.accordion-panel');
        panel.style.maxHeight = panel.scrollHeight + "px";
    };
    daysOptionsDiv.appendChild(btn);
});

const amountOptionsDiv = document.getElementById('amount-options');
const amountsList = [{v: 0.5, t: "نصف صفحة"}, {v: 1, t: "صفحة واحدة"}, {v: 2, t: "صفحتان"}, {v: 3, t: "3 صفحات"}, {v: 20, t: "جزء كامل (20 صفحة)"}];
amountsList.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'calc-btn'; btn.innerText = a.t;
    btn.onclick = () => calculatePlan(a.v);
    amountOptionsDiv.appendChild(btn);
});

const customBtn = document.createElement('button');
customBtn.className = 'calc-btn'; customBtn.innerText = "✏️ رقم آخر";
customBtn.onclick = () => {
    document.getElementById('custom-amount-div').style.display = 'block';
    const panel = document.getElementById('custom-amount-div').closest('.accordion-panel');
    panel.style.maxHeight = panel.scrollHeight + "px";
};
amountOptionsDiv.appendChild(customBtn);

function calculatePlan(pagesPerDay) {
    pagesPerDay = parseFloat(pagesPerDay);
    if(!pagesPerDay || pagesPerDay <= 0) return alert("الرجاء إدخال رقم صحيح");

    const totalPages = 604;
    const weeklyPages = selectedDays * pagesPerDay;
    const weeksNeeded = totalPages / weeklyPages;
    const totalDaysNeeded = Math.ceil(weeksNeeded * 7);
    
    let durationText = "";
    if (totalDaysNeeded < 30) {
        durationText = `${totalDaysNeeded} يوم`;
    } else if (totalDaysNeeded < 365) {
        const months = Math.floor(totalDaysNeeded / 30);
        const days = totalDaysNeeded % 30;
        durationText = `${months} شهر و ${days} يوم`;
    } else {
        const years = Math.floor(totalDaysNeeded / 365);
        const months = Math.floor((totalDaysNeeded % 365) / 30);
        durationText = `${years} سنة و ${months} شهر`;
    }

    const resultDiv = document.getElementById('calc-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>🎉 النتيجة المتوقعة</h3>
        <p>معدل الحفظ الأسبوعي: <strong>${weeklyPages} صفحات</strong></p>
        <p style="font-size:1.2rem; color:var(--primary-color); font-weight:bold;">
            ستختم القرآن كاملاً بإذن الله خلال:<br>
            ⏳ ${durationText}
        </p>
        <p style="font-size:0.9rem; color:gray">استعن بالله ولا تعجز 💪</p>
    `;
    
    document.getElementById('calc-step-2').style.display = 'none';
    document.getElementById('reset-calc').style.display = 'block';
    
    const panel = resultDiv.closest('.accordion-panel');
    panel.style.maxHeight = panel.scrollHeight + "px";
}

function resetCalc() {
    selectedDays = 0;
    document.getElementById('calc-result').style.display = 'none';
    document.getElementById('reset-calc').style.display = 'none';
    document.getElementById('calc-step-2').style.display = 'none';
    document.getElementById('custom-amount-div').style.display = 'none';
    document.getElementById('calc-step-1').style.display = 'block';
    document.getElementById('custom-pages').value = '';
    
    const panel = document.getElementById('calc-step-1').closest('.accordion-panel');
    panel.style.maxHeight = panel.scrollHeight + "px";
}

siteData.news.forEach(n => {
    document.getElementById('news-list').innerHTML += `
        <div class="card ${n.winners.length > 0 ? 'clickable' : ''}" onclick="toggleWinners(${n.id})">
            <strong>📅 ${n.date}</strong><br>${n.text}
            ${n.winners.length > 0 ? `<div id="win-${n.id}" class="winner-list">الفائزون: ${n.winners.join(' - ')}</div>` : ''}
        </div>`;
});
function toggleWinners(id) {
    const el = document.getElementById(`win-${id}`);
    if(el) el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

siteData.ranks.forEach(r => {
    let list = r.students.map((s, i) => `<li>${s} (المركز ${i+1})</li>`).join('');
    document.getElementById('ranks-list').innerHTML += `<div class="card" style="border-right:4px solid var(--accent-color)"><strong>${r.ring}</strong><ul style="margin:5px 0">${list}</ul></div>`;
});

function createTable(ringName, baseTime, isEvening) {
    let days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
    let table = `<h3>جدول ${ringName}</h3><table><thead><tr><th>اليوم</th><th>الوقت</th><th>الملاحظة</th></tr></thead><tbody>`;
    days.forEach(day => {
        let timeDisplay = baseTime;
        if (isEvening && day === "الخميس") timeDisplay = "إلى أذان العشاء";
        table += `<tr><td>${day}</td><td>${timeDisplay}</td><td>حفظ ومراجعة</td></tr>`;
    });
    document.getElementById('schedule-display').innerHTML = table + `</tbody></table>`;
}

siteData.afternoonRings.forEach(ring => {
    const b = document.createElement('button'); b.className = 'nav-btn'; b.innerText = ring.name;
    b.onclick = () => createTable(ring.name, ring.time, false);
    document.getElementById('ring-selectors-afternoon').appendChild(b);
});

siteData.eveningRings.forEach(ring => {
    const b = document.createElement('button'); b.className = 'nav-btn'; b.innerText = ring.name;
    b.onclick = () => createTable(ring.name, ring.time, true);
    document.getElementById('ring-selectors-evening').appendChild(b);
});

siteData.teachers.forEach(t => {
    document.getElementById('teachers-list').innerHTML += `<div class="card"><strong>${t.name}</strong><br><span style="color:gray">${t.job}</span></div>`;
});

const verses = [
    "﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾", "﴿ وَهَٰذَا كِتَابٌ أَنزَلْنَاهُ مُبَارَكٌ ﴾",
    "﴿ كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ ﴾", "﴿ إِنَّهُ لَقُرْآنٌ كَرِيمٌ ﴾", "﴿ قَدْ جَاءَكُم مِّنَ اللَّهِ نُورٌ وَكِتَابٌ مُّبِينٌ ﴾",
    "﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾", "﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾", "﴿ وَاذْكُر رَّبَّكَ كَثِيرًا ﴾",
    "﴿ وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ﴾", "﴿ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ ﴾", "﴿ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾",
    "﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾", "﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾", "﴿ وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ ﴾",
    "﴿ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ ﴾", "﴿ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ ﴾", "﴿ وَاللَّهُ خَيْرُ الْحَافِظِينَ ﴾",
    "﴿ وَهُوَ أَرْحَمُ الرَّاحِمِينَ ﴾", "﴿ فَاذْكُرُونِي أَذْكُرْكُمْ ﴾", "﴿ وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ ﴾",
    "﴿ إِنَّ اللَّهَ نِعِمَّا يَعِظُكُم بِهِ ﴾", "﴿ وَاللَّهُ يَهْدِي مَن يَشَاءُ ﴾", "﴿ وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ ﴾",
    "﴿ وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴾", "﴿ وَمَا عِندَ اللَّهِ خَيْرٌ وَأَبْقَىٰ ﴾", "﴿ إِنَّ اللَّهَ سَمِيعٌ بَصِيرٌ ﴾"
];
const verseDisplay = document.getElementById('verse-display');
function showRandomVerse() {
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    verseDisplay.innerText = randomVerse;
    verseDisplay.classList.add('visible');
    setTimeout(() => { verseDisplay.classList.remove('visible'); }, 8000);
}
showRandomVerse();
setInterval(showRandomVerse, 38000);
// ==========================================
// 🧠 نظام الاختبار الذكي (بدون ملفات إضافية)
// ==========================================

// خريطة بدايات الأجزاء (رقم الجزء: [رقم السورة, رقم الآية])
// هذا "المخ" الذي يعرف أين يبدأ كل جزء
const JUZ_START = {
    1: [1,1], 2: [2,142], 3: [2,253], 4: [3,93], 5: [4,24], 6: [4,148],
    7: [5,82], 8: [6,111], 9: [7,88], 10: [8,41], 11: [9,93], 12: [11,6],
    13: [12,53], 14: [15,1], 15: [17,1], 16: [18,75], 17: [21,1], 18: [23,1],
    19: [25,21], 20: [27,56], 21: [29,46], 22: [33,31], 23: [36,28], 24: [39,32],
    25: [41,47], 26: [46,1], 27: [51,31], 28: [58,1], 29: [67,1], 30: [78,1]
};

let currentQuizAnswer = {}; // لتخزين الإجابة الحالية

// 1. تهيئة القوائم عند التحميل
function initQuiz() {
    const juzSelect = document.getElementById('quiz-juz');
    if(!juzSelect) return; // حماية
    juzSelect.innerHTML = '<option value="0">-- اختر الجزء --</option>';
    for(let i=1; i<=30; i++) {
        let op = document.createElement('option');
        op.value = i;
        op.innerText = `الجزء ${i}`;
        juzSelect.appendChild(op);
    }
}
// استدعاء التهيئة بعد تحميل الصفحة بقليل للتأكد من وجود العناصر
setTimeout(initQuiz, 1000);

// 2. تحديث قائمة السور عند اختيار الجزء
function updateQuizSurahs() {
    if (!window.quranData) {
        alert("يرجى الانتظار، جاري تحميل المصحف...");
        loadQuranData(); // محاولة تحميل إذا لم يكن محملاً
        return;
    }
    
    const juz = parseInt(document.getElementById('quiz-juz').value);
    const surahSelect = document.getElementById('quiz-surah');
    surahSelect.innerHTML = '<option value="0">كل سور الجزء</option>';
    
    if (juz === 0) return;

    // منطق ذكي لمعرفة سور الجزء
    // نأخذ بداية هذا الجزء، وبداية الجزء التالي، ونحضر السور بينهما
    let startSurah = JUZ_START[juz][0];
    let endSurah = (juz === 30) ? 114 : JUZ_START[juz+1][0];

    for(let i = startSurah; i <= endSurah; i++) {
        let s = window.quranData[i];
        if(s) {
            let op = document.createElement('option');
            op.value = i;
            op.innerText = `${i}. سورة ${s.name}`;
            surahSelect.appendChild(op);
        }
    }
}

// 3. المحرك الرئيسي: توليد السؤال
function generateQuestion() {
    if (!window.quranData) { alert("تأكد من تحميل المصحف أولاً (افتح تبويب المصحف مرة واحدة)"); return; }
    
    const juz = parseInt(document.getElementById('quiz-juz').value);
    const targetSurah = parseInt(document.getElementById('quiz-surah').value);
    const type = document.getElementById('quiz-type').value;

    if (juz === 0) { alert("الرجاء اختيار الجزء أولاً"); return; }

    // تجميع الآيات المتاحة للاختيار
    let candidates = [];
    
    // تحديد نطاق البحث
    let startS = JUZ_START[juz][0];
    let startA = JUZ_START[juz][1];
    let endS = (juz === 30) ? 114 : JUZ_START[juz+1][0];
    
    // إذا اختار سورة محددة، نحصر النطاق فيها
    if (targetSurah !== 0) {
        startS = targetSurah;
        endS = targetSurah;
        startA = 1; // من أول السورة
    }

    // تعبئة "سلة" الآيات
    for (let s = startS; s <= endS; s++) {
        let surahObj = window.quranData[s];
        if (!surahObj) continue;
        
        // المرور على آيات السورة
        surahObj.ayahs.forEach(ay => {
            // فلترة دقيقة للأجزاء (لأن بعض السور مقسومة بين جزئين)
            // إذا كنا في أول سورة في الجزء، نبدأ من الآية المحددة في الخريطة
            if (s === JUZ_START[juz][0] && ay.num < JUZ_START[juz][1]) return;
            // إذا كنا في الجزء التالي (تجاوزنا الحد)، نتوقف (للحالات العامة)
            if (juz < 30 && s === JUZ_START[juz+1][0] && ay.num >= JUZ_START[juz+1][1]) return;

            candidates.push({
                surahName: surahObj.name,
                surahNum: s,
                ayahNum: ay.num,
                text: ay.text,
                nextAyah: surahObj.ayahs.find(a => a.num === ay.num + 1)?.text || "نهاية السورة"
            });
        });
    }

    if (candidates.length === 0) { alert("حدث خطأ في تحديد الآيات"); return; }

    // اختيار آية عشوائية
    let randomAyah = candidates[Math.floor(Math.random() * candidates.length)];
    
    // تجهيز السؤال والجواب
    let qText = "";
    let aText = "";
    let details = `سورة ${randomAyah.surahName} - آية ${randomAyah.ayahNum}`;

    if (type === 'complete') {
        qText = `أكمل الآية التي تلي:<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`;
        aText = randomAyah.nextAyah;
    } else if (type === 'surah_name') {
        qText = `هذه الآية في أي سورة؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`;
        aText = `سورة ${randomAyah.surahName}`;
    } else if (type === 'ayah_num') {
        qText = `ما هو رقم هذه الآية؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`;
        aText = `الآية رقم ${randomAyah.ayahNum}`;
    } else if (type === 'which_juz') {
        qText = `في أي جزء تقع هذه الآية؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span> <br> <small>(سورة ${randomAyah.surahName})</small>`;
        aText = `الجزء ${juz}`; // نعرف الجزء لأنه اختاره
    }

    // عرض في الشاشة
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('question-text').innerHTML = qText;
    document.getElementById('answer-box').style.display = 'none';
    document.getElementById('show-answer-btn').style.display = 'inline-block';
    
    // حفظ الإجابة
    currentQuizAnswer = { main: aText, det: details };
}

function showAnswer() {
    document.getElementById('show-answer-btn').style.display = 'none';
    document.getElementById('answer-box').style.display = 'block';
    document.getElementById('answer-text').innerHTML = currentQuizAnswer.main;
    document.getElementById('answer-details').innerText = currentQuizAnswer.det;
}
