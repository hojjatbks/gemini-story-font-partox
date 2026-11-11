let freeUsageCount = parseInt(localStorage.getItem('free_usage_count')) || 0;
const MAX_FREE_LIMIT = 3;

function checkFeatureAccess(featureCallback) {
    const isSubscriber = localStorage.getItem('is_subscriber') === 'true';
    if (isSubscriber) {
        featureCallback();
    } else {
        freeUsageCount++;
        localStorage.setItem('free_usage_count', freeUsageCount);
        if (freeUsageCount >= MAX_FREE_LIMIT) {
            showPromotionalAd(() => {
                freeUsageCount = 0;
                localStorage.setItem('free_usage_count', 0);
                featureCallback();
            });
        } else {
            featureCallback();
        }
    }
}

function showPromotionalAd(callback) {
    alert("نمایش ویدئوی تبلیغاتی ۱۰ ثانیه‌ای برای کاربران رایگان...");
    setTimeout(() => {
        alert("تبلیغ تمام شد! دسترسی فعال شد.");
        callback();
    }, 10000);
}

async function shareToStory() {
    checkFeatureAccess(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'استوری پارتاکس',
                    text: 'ساخته شده با اپلیکیشن پارتاکس مدیا',
                    url: window.location.href
                });
            } catch (err) {
                console.log('خطا در اشتراک‌گذاری:', err);
            }
        } else {
            alert("دستگاه شما از ارسال مستقیم پشتیبانی نمی‌کند. تصویر ذخیره شد.");
        }
    });
}