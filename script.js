// ====================================================
//        Djomoa Core Engine: The Pure Simulator
// ====================================================

// المصفوفة المرجعية لأيام الأسبوع (نقطة الانطلاق الثابتة للمشروع: اليوم 1 هو الجمعة)
const WEEK_DAYS = ["الجمعة", "السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

// أطوال الشهور الشمسية المعيارية
const SOLAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// أسماء الشهور لغرض العرض في الواجهة
const SOLAR_MONTH_NAMES = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const LUNAR_MONTH_NAMES = ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];

// 1. تدقيق كبس السنة الشمسية (النظام اليولياني/القرني المعياري)
function isSolarLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 2. تدقيق كبس السنة القمرية (الدورة الاصطلاحية الثلاثينية)
function isLunarLeap(year) {
    const leapYearsInCycle = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    return leapYearsInCycle.includes(year % 30);
}

// 3. دالة المحاكاة المطلقة: الحساب يوماً بيوم وتتبع التقويمين معاً
function runAbsoluteSimulation() {
    // إعدادات نقطة الصفر المشتركة (1 يناير سنة 1 = 1 محرم سنة 1)
    let sDay = 1, sMonth = 0, sYear = 1; // عدادات التقويم الشمسي
    let lDay = 1, lMonth = 0, lYear = 1; // عدادات التقويم القمري
    
    let totalDaysElapsed = 0; // العداد الكلي للأيام المارة في المشروع
    const TARGET_LUNAR_YEAR = 49999; // سقف التوقف القمري المستهدف
    
    let snapshotResult = null;

    // حلقة التكرار التي تمشي عبر الزمن يوماً تلو الآخر
    while (true) {
        totalDaysElapsed++;

        // [أ] تتبع حركة التاريخ القمري الفعلي
        let currentLunarMonthDays = (lMonth % 2 === 0) ? 30 : 29; // شهور وترية وزوجية بالتناوب
        if (lMonth === 11) { // شهر ذو الحجة يتأثر بالركود والكبس
            currentLunarMonthDays = isLunarLeap(lYear) ? 30 : 29;
        }

        // قنص اللحظة التاريخية المطلوبة: إتمام 30 ذو الحجة سنة 49999
        if (lYear === TARGET_LUNAR_YEAR && lMonth === 11 && lDay === currentLunarMonthDays) {
            let dayOfWeekIndex = (totalDaysElapsed - 1) % 7; // استخراج اسم اليوم بدقة رياضية
            
            snapshotResult = {
                lunarDate: `${lDay} ${LUNAR_MONTH_NAMES[lMonth]} ${lYear} هـ`,
                solarDate: `${sDay} ${SOLAR_MONTH_NAMES[sMonth]} ${sYear} م`,
                dayName: WEEK_DAYS[dayOfWeekIndex],
                daysCount: totalDaysElapsed
            };
            break; // إيقاف العداد القمري وتجميد المحاكاة فوراً عند خط النهاية
        }

        // الانتقال لليوم القمري التالي
        lDay++;
        if (lDay > currentLunarMonthDays) {
            lDay = 1;
            lMonth++;
            if (lMonth > 11) {
                lMonth = 0;
                lYear++;
            }
        }

        // [ب] تتبع حركة التاريخ الشمسي الفعلي بالتوازي
        let currentSolarMonthDays = SOLAR_MONTH_DAYS[sMonth];
        if (sMonth === 1 && isSolarLeap(sYear)) { // معالجة 29 فبراير في السنوات الكبيسة شمسياً
            currentSolarMonthDays = 29;
        }

        // الانتقال لليوم الشمسي التالي
        sDay++;
        if (sDay > currentSolarMonthDays) {
            sDay = 1;
            sMonth++;
            if (sMonth > 11) {
                sMonth = 0;
                sYear++;
            }
        }
    }

    return snapshotResult;
}

// 4. ربط العداد بالواجهة (عند الضغط على الزر يتم تفعيل المحاكي وعرض النتيجة)
function initDjomoaEngine() {
    const calcBtn = document.getElementById("calcBtn") || document.querySelector(".searchBox button");
    const container = document.querySelector(".searchBox");

    if (!calcBtn || !container) return;

    // تهيئة نص الزر ليدل على العداد الحقيقي
    calcBtn.textContent = "تشغيل العداد المثالي (50,000 سنة)";

    calcBtn.addEventListener("click", () => {
        // تشغيل العداد
        const result = runAbsoluteSimulation();

        // إنشاء أو تحديث صندوق عرض النتائج في الواجهة
        let resultBox = document.getElementById("engineResult");
        if (!resultBox) {
            resultBox = document.createElement("div");
            resultBox.id = "engineResult";
            resultBox.style.marginTop = "25px";
            resultBox.style.padding = "20px";
            resultBox.style.background = "rgba(0, 0, 0, 0.75)";
            resultBox.style.borderRadius = "16px";
            resultBox.style.border = "2px solid #ffd54f";
            resultBox.style.textAlign = "right";
            container.appendChild(resultBox);
        }

        resultBox.innerHTML = `
            <h3 style="color: #ffd54f; margin-bottom: 15px; font-size: 18px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">📊 نتيجة العداد الحقيقي لـ Djomoa</h3>
            
            <p style="margin: 8px 0; font-size: 15px; color: #fff;">🛑 <b>نقطة تجمد العداد القمري:</b> <span style="color: #ffb300; font-weight: bold;">${result.lunarDate}</span></p>
            
            <div style="background: rgba(167, 255, 235, 0.05); border-radius: 8px; padding: 12px; margin-top: 12px; border-right: 4px solid #a7ffeb;">
                <p style="margin: 0; font-size: 14px; color: #a7ffeb; font-weight: bold;">📅 التاريخ الشمسي الموازي في تلك اللحظة:</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; color: #fff;">
                    يوافق تماماً: <span style="color: #ffd54f; font-weight: bold;">${result.solarDate}</span>
                </p>
            </div>

            <div style="background: rgba(255, 213, 79, 0.05); border-radius: 8px; padding: 12px; margin-top: 10px; border-right: 4px solid #ffd54f;">
                <p style="margin: 0; font-size: 14px; color: #ffd54f; font-weight: bold;">📅 اسم اليوم الحقيقي عند التوقف الدقيق:</p>
                <p style="margin: 5px 0 0 0; font-size: 18px; color: #fff; font-weight: bold; text-align: center; color: #a7ffeb;">
                    يوم [ ${result.dayName} ]
                </p>
            </div>

            <p style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.4); text-align: center;">
                ⏳ عدد الأيام المطلقة المارة المتراكمة بالكامل: ${result.daysCount.toLocaleString()} يوماً.
            </p>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDjomoaEngine();
});
