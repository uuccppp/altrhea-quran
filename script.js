// === بيانات التطبيق ===

// 1. بيانات المعلمين
const teachers = [
    { name: "أ. سالم بن أحمد", role: "مشرف الحلقات", phone: "777000000" },
    { name: "أ. عمر بامدحج", role: "معلم التلاوة", phone: "777111111" },
    { name: "أ. عبدالله باوزير", role: "معلم الحفظ", phone: "777222222" }
];

// 2. بيانات الأوائل (5 حلقات - 3 فائزين لكل حلقة)
const ranksData = [
    {
        id: "ring1", name: "حلقة أبو بكر الصديق", icon: "🥇",
        winners: ["أحمد محمد سالم", "سعيد عمر باعباد", "علي حسين العطاس"]
    },
    {
        id: "ring2", name: "حلقة عمر بن الخطاب", icon: "🥈",
        winners: ["خالد عبدالله بن حيدر", "محمد صالح باكثير", "عبدالرحمن علي بلفقيه"]
    },
    {
        id: "ring3", name: "حلقة عثمان بن عفان", icon: "🥉",
        winners: ["سالم سعيد باسويد", "عمر محمد الجابري", "حسين أحمد بن سميط"]
    },
    {
        id: "ring4", name: "حلقة علي بن أبي طالب", icon: "✨",
        winners: ["عبدالله صالح العمودي", "يوسف محمد باحارثة", "إبراهيم علي السقاف"]
    },
    {
        id: "ring5", name: "حلقة خالد بن الوليد", icon: "⚔️",
        winners: ["حمزة سالم الكاف", "نوح عمر بلفقيه", "ياسر أحمد باوزير"]
    }
];

// 3. بيانات الجدول الدراسي (توزيع الأيام والحلقات)
const weekDays = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

// === دوال التشغيل الأساسية ===

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    setupNavigation();
    renderNews();
    renderTeachers();
    renderRanks();
    renderSchedule();
    setupAccordions();
    setupQuranTabs();
    initQuizSetup(); // تجهيز القوائم للاختبار
});

// --- إدارة الوضع الليلي ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-btn').innerText = isDark ? '🌙 ليلي' : '☀️ نهاري';
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-btn').innerText = '🌙 ليلي';
    }
}

// --- التنقل بين الأقسام ---
function setupNavigation() {
    const navItems = [
        { id: 'home', text: '🏠 الرئيسية' },
        { id: 'student', text: '📖 ركن الطالب' },
        { id: 'ranks', text: '🏆 الأوائل' },
        { id: 'schedule', text: '📅 الجداول' },
        { id: 'teachers', text: '👨‍🏫 المعلمون' },
        { id: 'about', text: '🕌 من نحن' },
        { id: 'mobile', text: '📱 التطبيق' }
    ];

    const navContainer = document.getElementById('nav-buttons');
    navItems.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = `nav-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = item.text;
        btn.onclick = () => showSection(item.id, btn);
        navContainer.appendChild(btn);
    });
}

function showSection(sectionId, btn) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// --- ركن الطالب (التبويبات) ---
function openQuranTab(tabName) {
    // إخفاء كل المحتويات
    document.querySelectorAll('.quran-content-section').forEach(div => div.style.display = 'none');
    document.querySelectorAll('.quran-tab').forEach(btn => btn.classList.remove('active'));

    // إظهار المطلوب
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    
    // تفعيل الزر (نبحث عن الزر الذي استدعى الدالة - حل بسيط عبر الـ event أو البحث بالنص)
    // هنا سنقوم بتفعيل الزر بناءً على ترتيبه أو نصّه، لكن للأمان سنجعل الأزرار في HTML تمرر 'this' مستقبلاً
    // أو ببساطة نعيد تعيين الكلاسات يدوياً في الـ HTML، لكن هنا بالجافاسكربت:
    const buttons = document.querySelectorAll('.quran-tab');
    if(tabName === 'reader') buttons[0].classList.add('active');
    if(tabName === 'tools') buttons[1].classList.add('active');
    if(tabName === 'quiz') buttons[2].classList.add('active');
}
// تشغيل التبويب الافتراضي عند التحميل
document.addEventListener('DOMContentLoaded', () => openQuranTab('reader'));


// --- القوائم المنسدلة (Accordions) ---
function setupAccordions() {
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
}

// --- عرض الأخبار ---
function renderNews() {
    const newsData = [
        "🎉 تكريم الطلاب المتميزين في حلقة أبو بكر الصديق لهذا الشهر.",
        "📢 بدء التسجيل للدورة الصيفية المكثفة الأسبوع القادم.",
        "🕌 إقامة مسابقة 'المزامير' لأجمل تلاوة يوم الخميس."
    ];
    const container = document.getElementById('news-list');
    container.innerHTML = newsData.map(news => `
        <div class="card clickable">
            <div style="display:flex; gap:10px; align-items:center;">
                <span style="font-size:1.5rem;">🗞️</span>
                <p style="margin:0;">${news}</p>
            </div>
        </div>
    `).join('');
}

// --- عرض المعلمين ---
function renderTeachers() {
    const container = document.getElementById('teachers-list');
    container.innerHTML = teachers.map(t => `
        <div class="card" style="display:flex; align-items:center; gap:15px; border-right:4px solid var(--primary-color);">
            <div style="background:var(--bg-light); padding:10px; border-radius:50%;">👨‍🏫</div>
            <div>
                <h3 style="margin:0; color:var(--primary-color);">${t.name}</h3>
                <p style="margin:5px 0; font-size:0.9rem; color:#666;">${t.role}</p>
            </div>
        </div>
    `).join('');
}

// --- عرض الأوائل (الحلقات) ---
function renderRanks() {
    const container = document.getElementById('ranks-list');
    container.innerHTML = `<div class="halaqa-grid">
        ${ranksData.map(rank => `
            <div class="halaqa-card" onclick="toggleHalaqa(this)">
                <div class="halaqa-header">
                    <span>${rank.name}</span>
                    <div class="halaqa-icon">${rank.icon}</div>
                </div>
                <div class="winners-list">
                    ${rank.winners.map((winner, idx) => `
                        <div class="winner-item">
                            <span class="medal">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                            <span>${winner}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>`;
}

function toggleHalaqa(card) {
    // إغلاق الحلقات الأخرى (اختياري، ليبقى التركيز على واحدة)
    document.querySelectorAll('.halaqa-card').forEach(c => {
        if (c !== card) c.classList.remove('active');
    });
    card.classList.toggle('active');
}

// --- عرض الجدول الدراسي (تعديل كامل) ---
function renderSchedule() {
    const container = document.getElementById('schedule-display');
    
    // بناء محتوى الجدول HTML
    let tableHTML = `
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>اليوم</th>
                    <th>الفترة</th>
                    <th>الحلقة</th>
                    <th>المكان</th>
                </tr>
            </thead>
            <tbody>
    `;

    weekDays.forEach(day => {
        // حلقة العصر (خالد بن الوليد)
        tableHTML += `
            <tr>
                <td rowspan="2" style="font-weight:bold; vertical-align:middle;">${day}</td>
                <td style="color:var(--primary-color);">☀️ العصر</td>
                <td>حلقة خالد بن الوليد</td>
                <td>المسجد - الجهة اليمنى</td>
            </tr>
            <tr>
                <td style="color:#1f2937;">🌙 المغرب</td>
                <td>أبو بكر، عمر، عثمان، علي</td>
                <td>المسجد - موزعة</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    </div>`;
    
    container.innerHTML = tableHTML;
}

// --- أدوات الختم (الحسابات) ---

// 1. إعداد القوائم
const amountOptions = document.getElementById('amount-options');
const daysOptions = document.getElementById('days-options');
const quranPages = 604;

if (daysOptions && amountOptions) { // التأكد من وجود العناصر
    // خيارات الأيام
    [1, 2, 3, 4, 5, 6].forEach(d => {
        daysOptions.innerHTML += `
            <button class="nav-btn" onclick="selectOption('days', ${d}, this)">${d} أيام</button>
        `;
    });

    // خيارات المقدار
    const amounts = [
        { label: "وجه واحد", val: 1 },
        { label: "وجهان", val: 2 },
        { label: "ثلاثة أوجه", val: 3 },
        { label: "نصف حزب (4)", val: 4 },
        { label: "حزب كامل (10)", val: 10 },
        { label: "جزء كامل (20)", val: 20 },
        { label: "رقم آخر ✏️", val: 'custom' }
    ];

    amounts.forEach(a => {
        amountOptions.innerHTML += `
            <button class="nav-btn" onclick="selectOption('amount', '${a.val}', this)">${a.label}</button>
        `;
    });
}

let userPlan = { days: 0, amount: 0 };

function selectOption(type, value, btn) {
    // تلوين الزر المختار
    const parent = btn.parentElement;
    Array.from(parent.children).forEach(c => c.classList.remove('active'));
    btn.classList.add('active');

    if (type === 'days') {
        userPlan.days = value;
        document.getElementById('calc-step-2').style.display = 'block';
        // تمرير تلقائي
        document.getElementById('calc-step-2').scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'amount') {
        if (value === 'custom') {
            document.getElementById('custom-amount-div').style.display = 'block';
            userPlan.amount = 0; // ننتظر الإدخال اليدوي
        } else {
            document.getElementById('custom-amount-div').style.display = 'none';
            calculatePlan(value);
        }
    }
}

function calculatePlan(amount) {
    if (!userPlan.days || !amount) return;
    
    const weeklyPages = userPlan.days * amount;
    const totalWeeks = Math.ceil(quranPages / weeklyPages);
    const totalMonths = (totalWeeks / 4.3).toFixed(1);
    const years = (totalMonths / 12).toFixed(1);

    const resultDiv = document.getElementById('calc-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>🎉 النتيجة:</h3>
        <p>بمعدل <strong>${amount}</strong> صفحات في <strong>${userPlan.days}</strong> أيام أسبوعياً:</p>
        <p style="font-size:1.2rem; color:var(--primary-color);">تختم القرآن كاملاً في <strong>${totalMonths}</strong> شهراً</p>
        <p style="font-size:0.9rem; color:#666;">(أي حوالي ${years} سنة تقريباً)</p>
    `;
    document.getElementById('reset-calc').style.display = 'block';
}

function resetCalc() {
    userPlan = { days: 0, amount: 0 };
    document.getElementById('calc-result').style.display = 'none';
    document.getElementById('calc-step-2').style.display = 'none';
    document.getElementById('reset-calc').style.display = 'none';
    document.querySelectorAll('#days-options .nav-btn, #amount-options .nav-btn').forEach(b => b.classList.remove('active'));
}

// --- دليل الختم العكسي (حسب الوقت) ---
// تعبئة القوائم
const targetDays = document.getElementById('target-days');
const targetMonths = document.getElementById('target-months');
const targetYears = document.getElementById('target-years');

if (targetDays) {
    for(let i=10; i<=90; i+=10) targetDays.innerHTML += `<option value="${i}">${i} يوم</option>`;
    targetDays.innerHTML += `<option value="100">100 يوم</option>`;
    
    for(let i=1; i<=24; i++) targetMonths.innerHTML += `<option value="${i}">${i} شهر</option>`;
    
    for(let i=1; i<=5; i++) targetYears.innerHTML += `<option value="${i}">${i} سنوات</option>`;
}

function calculateReversePlan() {
    // نحدد أي قائمة تم اختيارها (الأولوية للسنوات ثم الأشهر ثم الأيام إذا تم التغيير)
    // للتبسيط، سنأخذ القيمة من الـ Select الذي تم تغييره آخر مرة، أو نضع منطق بسيط:
    // هنا سنفترض أن المستخدم يختار واحداً فقط، لكن في الكود سنقرأ الجميع ونأخذ الأكبر أو المختار
    // الحل الأبسط: سنأخذ القيمة بناءً على ما يريده المستخدم. 
    // لنجعل الأمر تفاعلياً أكثر، سنقوم بالحساب بناءً على المدخلات المتاحة.
    
    // سنقوم بحساب بسيط افتراضي: نأخذ القيمة من "الختم بالأشهر" كقيمة أساسية للتجربة
    // أو نطور الكود ليقرأ الحقل الذي تم تفعيله.
    // لتبسيط الكود عليك: سنأخذ قيمة الأشهر كمعيار افتراضي للحساب في هذا المثال
    
    let totalDays = document.getElementById('target-months').value * 30; // تقريب
    let planType = document.querySelector('input[name="planType"]:checked').value;
    
    let dailyPages = Math.ceil(quranPages / totalDays);
    
    const resultDiv = document.getElementById('reverse-calc-result');
    resultDiv.style.display = 'block';
    
    let advice = "";
    if (dailyPages > 20) advice = "⚠️ همة عالية جداً! قد تحتاج لتفرغ كامل.";
    else if (dailyPages > 10) advice = "💪 ممتاز! تحتاج لجهد مضاعف.";
    else advice = "✅ خطة مريحة ومناسبة.";

    resultDiv.innerHTML = `
        <h3>🗓️ خطة ${planType}:</h3>
        <p>لكي تختم في هذه المدة، تحتاج لإنجاز:</p>
        <p style="font-size:1.5rem; color:var(--primary-color); font-weight:bold;">${dailyPages} صفحات يومياً</p>
        <p style="font-size:0.9rem; color:gray;">${advice}</p>
    `;
}

// --- المصحف والاختبار ---
// ملاحظة: لجعل الكود يعمل بدون ملفات خارجية ضخمة، سنستخدم بيانات تجريبية (Placeholder)
// يمكنك استبدالها بملف JSON كامل للمصحف لاحقاً.

const sampleSurahs = [
    { number: 1, name: "الفاتحة", ayahs: 7 },
    { number: 2, name: "البقرة", ayahs: 286 },
    { number: 3, name: "آل عمران", ayahs: 200 },
    { number: 18, name: "الكهف", ayahs: 110 },
    { number: 36, name: "يس", ayahs: 83 },
    { number: 112, name: "الإخلاص", ayahs: 4 },
    { number: 113, name: "الفلق", ayahs: 5 },
    { number: 114, name: "الناس", ayahs: 6 }
];

function searchQuran() {
    const query = document.getElementById('quran-search').value;
    const container = document.getElementById('surah-list-container');
    const loader = document.getElementById('quran-loader');
    
    loader.style.display = 'none'; // إخفاء التحميل
    
    // فلترة السور (بحث بسيط في العينة)
    const results = sampleSurahs.filter(s => s.name.includes(query));
    
    container.innerHTML = results.map(s => `
        <div class="surah-list-item" onclick="openSurahReader(${s.number}, '${s.name}')">
            <span style="font-weight:bold;">سورة ${s.name}</span>
            <div class="surah-number-badge">${s.number}</div>
        </div>
    `).join('');
    
    if (results.length === 0) container.innerHTML = "<p style='text-align:center; color:gray;'>لا توجد نتائج (جرب: الفاتحة، البقرة، الكهف...)</p>";
}

// تشغيل البحث عند التحميل لعرض القائمة الأولية
document.addEventListener('DOMContentLoaded', () => {
    // محاكاة تأخير التحميل
    setTimeout(() => searchQuran(), 500);
});

function openSurahReader(num, name) {
    document.getElementById('surah-list-view').style.display = 'none';
    document.getElementById('surah-reader-view').style.display = 'block';
    
    const contentDiv = document.getElementById('reader-content');
    contentDiv.innerHTML = `
        <div class="surah-header"><h2>سورة ${name}</h2></div>
        <div class="basmala">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <div class="ayah-container">
            (هنا سيتم عرض نص الآيات - يتطلب قاعدة بيانات كاملة)<br>
            <br>
            [نص تجريبي] الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ...
        </div>
    `;
}

function backToSurahList() {
    document.getElementById('surah-list-view').style.display = 'block';
    document.getElementById('surah-reader-view').style.display = 'none';
}

// --- الاختبار (Quiz) ---
function initQuizSetup() {
    const juzSelect = document.getElementById('quiz-juz');
    if(!juzSelect) return;
    for(let i=1; i<=30; i++) juzSelect.innerHTML += `<option value="${i}">الجزء ${i}</option>`;
}

function updateQuizSurahs() {
    // يمكن ربط السور بالأجزاء لاحقاً
    console.log("تحديث السور بناء على الجزء");
}

function generateQuestion() {
    const type = document.getElementById('quiz-type').value;
    const quizArea = document.getElementById('quiz-area');
    
    quizArea.style.display = 'block';
    document.getElementById('answer-box').style.display = 'none';
    document.getElementById('show-answer-btn').style.display = 'inline-block';

    // سؤال تجريبي
    let qText = "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا";
    let aText = "سورة الكهف - الآية 107";
    
    if (type === 'complete') {
        qText = "أكمل الآية: (إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ ...)";
        aText = "جَنَّاتُ الْفِرْدَوْسِ نُزُلًا";
    }

    document.getElementById('question-text').innerText = qText;
    document.getElementById('answer-text').innerText = aText;
}

function showAnswer() {
    document.getElementById('answer-box').style.display = 'block';
    document.getElementById('show-answer-btn').style.display = 'none';
}
