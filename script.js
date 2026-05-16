// ===============================
// Djomoa Dual Calendar Engine
// ===============================

// عدد أيام السنة الشمسية
const SOLAR_YEAR_DAYS = 365.2425;

// عدد أيام السنة القمرية
const LUNAR_YEAR_DAYS = 354.367;

// الفارق السنوي
const YEAR_DIFF = SOLAR_YEAR_DAYS - LUNAR_YEAR_DAYS;

// حساب الفارق التراكمي
function cumulativeDifference(years) {
    return (YEAR_DIFF * years).toFixed(2);
}

// تحويل السنوات الشمسية إلى قمرية
function solarToLunarYears(solarYears) {
    return (solarYears * SOLAR_YEAR_DAYS / LUNAR_YEAR_DAYS).toFixed(2);
}

// تحويل السنوات القمرية إلى شمسية
function lunarToSolarYears(lunarYears) {
    return (lunarYears * LUNAR_YEAR_DAYS / SOLAR_YEAR_DAYS).toFixed(2);
}

// إنشاء بيانات رزمانة
function generateCalendar(startYear, endYear) {

    let results = [];

    for (let year = startYear; year <= endYear; year++) {

        let cumulative = cumulativeDifference(year);

        let lunarEquivalent = solarToLunarYears(year);

        results.push({
            solarYear: year,
            lunarYear: lunarEquivalent,
            cumulativeDifference: cumulative
        });
    }

    return results;
}

// عرض النتائج في المتصفح
function displayCalendar(startYear, endYear) {

    const container = document.getElementById("results");

    if (!container) return;

    container.innerHTML = "";

    const data = generateCalendar(startYear, endYear);

    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "year-card";

        card.innerHTML = `
            <h3>السنة الشمسية: ${item.solarYear}</h3>
            <p>السنة القمرية المقابلة: ${item.lunarYear}</p>
            <p>الفارق التراكمي: ${item.cumulativeDifference} يوم</p>
        `;

        container.appendChild(card);
    });
}

// مثال تشغيل
displayCalendar(1, 50);

console.log("Djomoa Engine Running");
document.body.style.background = "#111";