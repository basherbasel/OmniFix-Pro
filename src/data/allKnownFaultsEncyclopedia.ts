import { UniversalKnownFault } from '../types';

export const ALL_KNOWN_FAULTS_ENCYCLOPEDIA: UniversalKnownFault[] = [
  // 1. Qualcomm Crashdump Mode
  {
    id: 'flt_qualcomm_crashdump',
    title: 'وضع الانهيار كوالكوم (Qualcomm Crashdump Mode / Ramdump Screen)',
    osScope: 'Android',
    category: 'bootloop',
    affectedBrands: ['OnePlus', 'Xiaomi', 'Motorola', 'Oppo', 'Asus ROG', 'Realme'],
    symptoms: 'ظهور شاشة سوداء مكتوب عليها Qualcomm Crashdump Mode مع توقف كامل للإقلاع وتعذر الدخول للريكفري.',
    rootCause: 'انهيار في قطاع الـ Kernel (boot.img) أو تلف في ملفات التهيئة xbl / abl أو خطأ في قراءة قطاع modemst1 أثناء إقلاع المعالج.',
    hardwareOrSoftware: 'testpoint_edl',
    directProtocolSolution: [
      'الدخول في وضع EDL 9008 عبر كابل EDL أو TestPoint.',
      'تفريغ وإعادة تفليش قطاعات boot_a, boot_b, dts, xbl_a, xbl_b.',
      'تصفير قطاع misc لإلغاء راية الـ Crashdump Force.',
      'إعادة التشغيل إلى وضع Fastboot ثم تفليش روم رسمي مستقر.',
    ],
    recommendedTool: 'UMT QcFire / UnlockTool EDL Engine',
    successRate: 97,
    dangerLevel: 'Moderate',
  },

  // 2. Baseband Unknown & IMEI Null
  {
    id: 'flt_baseband_unknown_imei_null',
    title: 'فقدان رقم السيريال وإصدار النطاق الأساسي (Baseband Unknown & IMEI Null)',
    osScope: 'Android',
    category: 'baseband_network',
    affectedBrands: ['Samsung', 'Xiaomi', 'Pixel', 'Huawei', 'OnePlus', 'Transsion'],
    symptoms: 'إصدار النطاق الأساسي (Baseband Version) يظهر "غير معروف"، والـ IMEI فارغ أو يظهر 00000000000000/01 ولا توجد خدمة شبكة إطلاقاً.',
    rootCause: 'تلف أو مسح في قطاعات EFS أو NVRAM أو NVDATA أو تلف ملف معايرة الترددات QCN / SEC نتيجة تفليش خاطئ أو انقطاع تيار.',
    hardwareOrSoftware: 'software_only',
    directProtocolSolution: [
      'تصفير قطاعات modemst1 و modemst2 التالفة.',
      'حقن ملف QCN أصلي معاير ومطابق لطراز الهاتف عبر منفذ Qualcomm Diag Port.',
      'إعادة كتابة الـ IMEI الأصلي للهاتف المطبوع على ظهر العلبة.',
      'تطبيق باتش توقيع شهادة المودم (Patch Certificate) وإعادة تشغيل الهاتف.',
    ],
    recommendedTool: 'Chimera Tool / Z3X Samsung Pro Engine',
    successRate: 94,
    dangerLevel: 'Expert',
  },

  // 3. iPhone Error 1110 (Full Storage Bootloop)
  {
    id: 'flt_iphone_error_1110_full_storage',
    title: 'تعليق الآيفون على التفاحة بسبب امتلاء الذاكرة (iOS Error 1110 Full Storage Bootloop)',
    osScope: 'iOS',
    category: 'bootloop',
    affectedBrands: ['Apple iPhone', 'Apple iPad'],
    symptoms: 'إضاءة شعار آبل وإعادة التشغيل باستمرار بعد امتلاء سعة التخزين 100%، وعند التفليش يظهر خطأ 1110 في iTunes/3uTools.',
    rootCause: 'عدم وجود حتى 1 ميجابايت من المساحة الفارغة للـ SpringBoard لكتابة سجلات الـ APFS Snapshot والـ Caches أثناء تشغيل النظام.',
    hardwareOrSoftware: 'software_only',
    directProtocolSolution: [
      'إدخال الآيفون في وضع Recovery Mode.',
      'استخدام بروتوكول "Retain User Data Fix" لتفليش نفس إصدار iOS المماثل أو أحدث.',
      'إرسال بايلود تنظيف سجلات الـ Temporary App Caches أثناء مرحلة استعادة النظام.',
      'إقلاع الآيفون بسلام والاحتفاظ بكافة الصور والفيديوهات والواتساب دون فقدان بايت واحد.',
    ],
    recommendedTool: 'Universal Master iOS Flash Engine / 3uTools Fix',
    successRate: 98,
    dangerLevel: 'Safe',
  },

  // 4. iPhone Error 4013 (Baseband / NAND / Sensor I2C Bus Conflict)
  {
    id: 'flt_iphone_error_4013',
    title: 'خطأ 4013 أثناء تفليش واستعادة الآيفون (iTunes Error 4013 NAND/Baseband Handshake)',
    osScope: 'iOS',
    category: 'memory_ufs',
    affectedBrands: ['Apple iPhone X, 11, 12, 13, 14, 15, 16 Series'],
    symptoms: 'ظهور شريط التقدم الأبيض في شاشة الآيفون ثم توقفه عند 18% وانقطاع الاتصال وظهور Error 4013.',
    rootCause: 'سحب فولتية في خط I2C_SDA_SCL بسبب فلاتة السماعة العلوية (Proximity Sensor) أو عطل مؤقت في تغذية آيسي الباور الخاص بالمودم Baseband PMIC.',
    hardwareOrSoftware: 'component_safe',
    directProtocolSolution: [
      'فصل فلاتة السماعة العلوية ومستشعر الوجه مؤقتاً أثناء التفليش.',
      'استخدام كابل Type-C إلى Lightning أصلي بمنفذ USB مباشر في اللوحة الأم.',
      'إدخال الجهاز في وضع DFU Mode الصرف وتمرير فلاشة IPSW كاملة مع خيار Full Restore.',
      'إعادة تركيب الفلاتة بعد انتهاء التفليش.',
    ],
    recommendedTool: 'Apple DFU Hardware Engine',
    successRate: 92,
    dangerLevel: 'Moderate',
  },

  // 5. Samsung SW REV CHECK FAIL (Anti-Rollback)
  {
    id: 'flt_samsung_sw_rev_check_fail',
    title: 'خطأ الحماية والرجوع للخلف في سامسونج (SW REV CHECK FAIL Binary Block)',
    osScope: 'Android',
    category: 'anti_rollback',
    affectedBrands: ['Samsung Galaxy (S, A, Z, M, Note, F Series)'],
    symptoms: 'ظهور نص أحمر في وضع Download Mode: SW REV CHECK FAIL: [boot] Device: 4, Binary: 3 ورفض التفليش.',
    rootCause: 'محاولة تفليش إصدار حماية (Binary Level U/S) أقل من الرقم المسجل في عداد الـ RPMB بالمعالج.',
    hardwareOrSoftware: 'software_only',
    directProtocolSolution: [
      'قراءة رقم الحماية الحقيقي في شاشة الداونلود (مثلاً B:4 أو U:5).',
      'تحميل الروم الرسمي الموجه لنفس الموديل بنفس رقم الحماية أو أعلى (Binary Level >= Device Level).',
      'تفليش الملفات الأربعة الكاملة (BL, AP, CP, CSC) باستخدام أداة Heimdall / Odin.',
    ],
    recommendedTool: 'Z3X Samsung Tool Pro / Odin Engine',
    successRate: 100,
    dangerLevel: 'Safe',
  },

  // 6. DM-Verity Corruption & Red/Orange State
  {
    id: 'flt_dm_verity_red_orange_state',
    title: 'فساد التحقق الأمني والشاشة الحمراء (DM-Verity Corruption & Red/Orange State)',
    osScope: 'Android',
    category: 'bootloop',
    affectedBrands: ['Xiaomi', 'Realme', 'Oppo', 'OnePlus', 'Motorola', 'Vivo'],
    symptoms: 'ظهور رسالة تحذير: "Your device has failed verification and may not work properly" مع إعادة التشغيل التلقائي كل 5 ثوان.',
    rootCause: 'تعديل أو تلف في قطاع الـ vbmeta.img أو عدم تطابق توقيع الـ Hash الخاص بالنواة والـ System.',
    hardwareOrSoftware: 'software_only',
    directProtocolSolution: [
      'الدخول في وضع Fastboot Mode.',
      'تفليش قطاع vbmeta مع إلغاء التحقق عبر الأوامر: --disable-verity --disable-verification.',
      'تفليش ملف boot.img و dtbo.img الأصليين للروم الرسمي.',
      'إعادة التشغيل مع زوال الرسالة التحذيرية واستقرار النظام 100%.',
    ],
    recommendedTool: 'Fastboot Engine / EFT Pro Master',
    successRate: 99,
    dangerLevel: 'Safe',
  },

  // 7. Touch Screen Unresponsive After System Update
  {
    id: 'flt_touch_unresponsive_after_update',
    title: 'توقف اللمس عن العمل بعد التحديث أو تغيير الشاشة (Touch Dead After OTA/Flash)',
    osScope: 'All Systems',
    category: 'display_touch',
    affectedBrands: ['Samsung (A-Series)', 'Xiaomi', 'Infinix', 'Tecno', 'Honor'],
    symptoms: 'الشاشة تعرض الصورة بجودة عالية ولكن اللمس متوقف تماماً عن الاستجابة بعد تثبيت تحديث هوائي أو تفليش روم جديد.',
    rootCause: 'عدم تطابق تعريف الدرايفر الخاص بلوحة اللمس (Touch IC IC-Firmware) في قطاع vendor.img أو عدم كتابة ملف الـ Touch Calibration.',
    hardwareOrSoftware: 'software_only',
    directProtocolSolution: [
      'توصيل ماوس USB عبر كابل OTG للتحكم المؤقت بالجهاز.',
      'تفليش ملف TSP FW Patch المناسب لموديل لوحة اللمس (Novatek / FocalTech / Synaptics).',
      'إصدار أمر معايرة اللمس عبر ADB: echo 1 > /sys/class/sec/tsp/cmd.',
      'إعادة التشغيل ليعمل اللمس بدقة وسلاسة 100%.',
    ],
    recommendedTool: 'Universal Touch Driver Fixer / ADB Master',
    successRate: 96,
    dangerLevel: 'Safe',
  },

  // 8. Memory UFS/eMMC Bad Health (Wear Level 90% Exhausted)
  {
    id: 'flt_memory_ufs_emmc_health_bad',
    title: 'استهلاك وتلف خلايا الذاكرة الداخلية (eMMC / UFS Wear Level 90% Bad Health)',
    osScope: 'All Systems',
    category: 'memory_ufs',
    affectedBrands: ['All Brands (Samsung, Xiaomi, Huawei, Apple, Vivo, Oppo)'],
    symptoms: 'الهاتف بطيء جداً، يعود للوضع القديم بعد الفورمات (Read-Only Mode)، أو يعلق على الشعار بعد بضع دقائق.',
    rootCause: 'استنفاد القطاعات الاحتياطية (Reserved Block Exhaustion) وتجاوز نسبة الاستهلاك 90% (Device Life Time Estimation Type A/B 0x0B).',
    hardwareOrSoftware: 'isp_ufs',
    directProtocolSolution: [
      'توصيل الهاتف عبر منفذ ISP UFS أو EDL 9008.',
      'سحب نسخة احتياطية كاملة من ملفات التشفير والسيريال (EFS / NVRAM / Radio).',
      'إجراء عملية تصفير عدادات الـ SLC Buffer وإعادة برمجة أقسام الـ LUN0-LUN5 وتحديث الـ Firmware الخاص برقاقة الذاكرة.',
      'إعادة كتابة ملفات الـ Dump وتفليش النظام الرسمي.',
    ],
    recommendedTool: 'EasyJTAG Plus / Medusa Pro UFS Engine',
    successRate: 88,
    dangerLevel: 'Expert',
  },
];
