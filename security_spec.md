# Security Payload TDD Specification - تمكين الرقمية Pro

## 1. Data Invariants
- لا يمكن إنشاء حملة (Campaign) لمستخدم آخر.
- لا يمكن تعديل `ownerId` بعد الإنشاء.
- لا يمكن قراءة بيانات مستخدم آخر (PII isolation).
- المحتوى (Post) يجب أن يتبع حملة موجودة يملكها المستخدم.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Identity Spoofing:** محاولة إنشاء حملة بـ `ownerId` لشخص آخر.
2. **Privilege Escalation:** محاولة مستخدم عادي تعديل دوره إلى `admin`.
3. **Ghost Field Injection:** محاولة إضافة حقل `isVerified: true` لبروفايل المستخدم.
4. **Resource Poisoning:** محاولة حقن نص بحجم 1MB في عنوان الحملة.
5. **Orphaned Record:** محاولة إنشاء منشور (Post) تابع لحملة غير موجودة.
6. **Unauthorized Read:** محاولة مستخدم B قراءة حملة مستخدم A عبر تخمين الـ ID.
7. **Terminal State Bypass:** محاولة تعديل منشور حالته `published`.
8. **Identity Poisoning:** استخدام ID يحتوي على رموز برمجية في مسار الوثيقة.
9. **Missing Verification:** محاولة الكتابة بحساب بريد إلكتروني غير موثق (`email_verified: false`).
10. **Shadow Update:** محاولة تعديل `createdAt` في حملة قائمة.
11. **Cross-Tenant Leak:** محاولة قائمة منشورات (List) دون فلترة الـ `creatorId`.
12. **Type Confusion:** إرسال رقم في حقل متوقع منه نص (String).

## 3. Test Criteria
يجب أن تعيد كافة هذه الطلبات `PERMISSION_DENIED`.
