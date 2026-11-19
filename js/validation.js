// js/validation.js
export function validateUser({ name, age, email, address }) {
    const errors = {};

    if (name === "") errors.name = "من فضلك اكتب الاسم";
    if (!age || age < 1 || age > 120) errors.age = "اكتب عمر صحيح (من 1 إلى 120)";
    if (address === "") errors.address = "من فضلك اكتب العنوان";

       // التحقق من الإيميل
    if (email === "") {
        errors.email = "اكتب البريد الالكترونى";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "صيغة البريد الإلكتروني غير صحيحة";
        }
    }
    return errors; 
}