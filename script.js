// ===============================
// Djomoa Dual Calendar Engine
// ===============================

// الثوابت الفلكية
const SOLAR_YEAR_DAYS = 365.2425; // عدد أيام السنة الشمسية المعيارية
const LUNAR_YEAR_DAYS = 354.367;  // عدد أيام السنة القمرية المعيارية
const YEAR_DIFF = SOLAR_YEAR_DAYS - LUNAR_YEAR_DAYS; // الفارق السنوي بالأيام

// 1. نظام التنقل بين صفحات المنصة (SPA)
function switchPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // إزالة الصفة النشطة من جميع أزرار القائمة
    document.querySelectorAll('.menu button').forEach(btn => {
        btn.classList.remove('active-btn');
    });
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(`${pageId}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // تفعيل الزر المضغوط
    const clickedBtn = Array.from(document.querySelectorAll('.menu button')).find(btn => btn.getAttribute('onclick').includes(pageId));
    if (clickedBtn) {
        clickedBtn.classList.add('active-btn');
    }
}

// 2. المحرك الرياضي للحساب الزمني
// حساب الفارق التراكمي بالأيام
function cumulativeDifference(years) {
    return (YEAR_DIFF * years).toFixed(1);
}

// تحويل السنوات الشمسية إلى قمرية
function solarToLunarYears(solarYears) {
    return Math.floor(solarYears * SOLAR_YEAR_DAYS / LUNAR_YEAR_DAYS);
}

// تحويل السنوات القمرية إلى شمسية
function lunarToSolarYears(lunarYears) {
    return Math.floor(lunarYears * LUNAR_YEAR_DAYS / SOLAR_YEAR_DAYS);
}

// 3. تحديث بيانات لوحة التحكم الرئيسية تلقائياً (السنوات الحالية)
function initDashboard() {
    const currentSolarYear = 2026; // السنة الشمسية الحالية
    const currentLunarYear = solarToLunarYears(currentSolarYear - 622); // التقريب الفلكي للهجرة

    const solarElem = document.getElementById("solarValue");
    const lunarElem = document.getElementById("lunarValue");
    const accumElem = document.getElementById("accumulatedValue");

    if (solarElem) solarElem.textContent = `${currentSolarYear} م`;
    if (lunarElem) lunarElem.textContent = `${currentLunarYear} هـ`;
    if (accumElem) accumElem.textContent = `± ${cumulativeDifference(50000)} يوم`;
}

// 4. معالجة عمليات صفحة البحث والتحويل
function handleCalculation() {
    const yearInput = document.getElementById("yearInput");
    const calcBtn = document.getElementById("calcBtn");
    
    if (!yearInput || !calcBtn) return;

    calcBtn.addEventListener("click", () => {
        const inputVal = parseInt(yearInput.value);
        
        if (!inputVal || inputVal <= 0) {
            alert("يرجى إدخال سنة صحيحة أكبر من الصفر");
            return;
        }

        const lunarEquiv = solarToLunarYears(inputVal);
        const diffDays = cumulativeDifference(inputVal);

        // عرض النتيجة بأسلوب حواري أنيق داخل صندوق البحث
        let resultContainer = document.getElementById("searchResult");
        if (!resultContainer) {
            resultContainer = document.createElement("div");
            resultContainer.id = "searchResult";
            resultContainer.style.marginTop = "20px";
            resultContainer.style.padding = "15px";
            resultContainer.style.background = "rgba(255,255,255,0.05)";
            resultContainer.style.borderRadius = "10px";
            resultContainer.style.border = "1px solid rgba(255,213,79,0.2)";
            document.querySelector(".searchBox").appendChild(resultContainer);
        }

        resultContainer.innerHTML = `
            <p style="margin-bottom: 8px; color: #ffd54f; font-weight: bold;">نتائج الحساب لـ ${inputVal} سنة شمسية:</p>
            <p style="font-size: 14px; color: #fff;">يعادل فلكياً: <span style="color: #a7ffeb; font-weight: bold;">${lunarEquiv} سنة قمرية</span></p>
            <p style="font-size: 14px; color: #fff;">الفارق التراكمي المفقود: <span style="color: #9ecbff; font-weight: bold;">${diffDays} يوم</span></p>
        `;
    });
}

// تشغيل المحرك عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
    handleCalculation();
    console.log("Djomoa Dual Calendar Engine - Initialized Successfully");
});
