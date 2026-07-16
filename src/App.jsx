import { useState, useEffect, useCallback } from "react";
import { MapPin, Clock, AlertCircle, ChevronLeft, RotateCcw, BookOpen, Calendar, MessageCircle, Send } from "lucide-react";

// ---------- Prayer Constants ----------
const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const PRAYER_ARABIC = {
  Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر",
  Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};

const PRAYER_EMOJI = {
  Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️",
  Asr: "🌤", Maghrib: "🌇", Isha: "🌃",
};

// ---------- Full Azkar Data ----------
const AZKAR_CATEGORIES = [
  {
    id: "morning",
    title: "Morning Adhkar",
    arabic: "أذكار الصباح",
    emoji: "🌅",
    time: "After Fajr",
    items: [
      {
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Ayatul Kursi — Allahu la ilaha illa huwal hayyul qayyum, la ta'khudhuhu sinatun wa la nawm...",
        translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        source: "Quran 2:255 — Whoever recites this in the morning will be protected until evening (Nasa'i, Silsilah Sahihah 972)",
        count: 1,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nقُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
        transliteration: "Qul huwa Allahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
        translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
        source: "Surah Al-Ikhlas (Quran 112) — Recite 3 times in morning and evening (Abu Dawud 5082)",
        count: 3,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
        transliteration: "Qul a'udhu bi rabbil falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin naffathati fil 'uqad. Wa min sharri hasidin idha hasad.",
        translation: "Say: I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies.",
        source: "Surah Al-Falaq (Quran 113) — Recite 3 times in morning and evening (Abu Dawud 5082)",
        count: 3,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
        transliteration: "Qul a'udhu bi rabbin nas. Malikin nas. Ilahin nas. Min sharril waswasil khannas. Alladhi yuwaswisu fi sudurin nas. Minal jinnati wan nas.",
        translation: "Say: I seek refuge in the Lord of mankind. The King of mankind. The God of mankind. From the evil of the retreating whisperer. Who whispers into the hearts of mankind. From among the jinn and mankind.",
        source: "Surah An-Nas (Quran 114) — Recite 3 times in morning and evening (Abu Dawud 5082)",
        count: 3,
      },
      {
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir.",
        translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
        source: "Abu Dawud 5077",
        count: 1,
      },
      {
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan nushur.",
        translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
        source: "Abu Dawud 5068, Tirmidhi 3391",
        count: 1,
      },
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "SubhanAllahi wa bihamdih.",
        translation: "Glory be to Allah and all praise is due to Him.",
        source: "Bukhari 6405, Muslim 2692 — Whoever says this 100 times in the morning has their sins forgiven even if they were like the foam of the sea.",
        count: 100,
      },
      {
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
        transliteration: "Allahumma afini fi badani, Allahumma afini fi sam'i, Allahumma afini fi basari, la ilaha illa ant.",
        translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You.",
        source: "Abu Dawud 5090",
        count: 3,
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ",
        transliteration: "Allahumma inni a'udhu bika minal kufri wal faqr, wa a'udhu bika min 'adhabil qabr, la ilaha illa ant.",
        translation: "O Allah, I seek refuge in You from disbelief and poverty, and I seek refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
        source: "Abu Dawud 5090",
        count: 3,
      },
    ],
  },
  {
    id: "evening",
    title: "Evening Adhkar",
    arabic: "أذكار المساء",
    emoji: "🌙",
    time: "After Asr",
    items: [
      {
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration: "Ayatul Kursi",
        translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep...",
        source: "Quran 2:255 — Whoever recites this in the evening will be protected until morning (Nasa'i, Silsilah Sahihah 972)",
        count: 1,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
        transliteration: "Surah Al-Ikhlas",
        translation: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
        source: "Surah Al-Ikhlas (Quran 112) — Recite 3 times evening (Abu Dawud 5082)",
        count: 3,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
        transliteration: "Surah Al-Falaq",
        translation: "Say: I seek refuge in the Lord of daybreak from the evil of that which He created...",
        source: "Surah Al-Falaq (Quran 113) — Recite 3 times evening (Abu Dawud 5082)",
        count: 3,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
        transliteration: "Surah An-Nas",
        translation: "Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind...",
        source: "Surah An-Nas (Quran 114) — Recite 3 times evening (Abu Dawud 5082)",
        count: 3,
      },
      {
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir.",
        translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
        source: "Abu Dawud 5077",
        count: 1,
      },
      {
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal masir.",
        translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the return.",
        source: "Abu Dawud 5068",
        count: 1,
      },
      {
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        source: "Muslim 2709 — Whoever says this 3 times in the evening, no poison or venom will harm him",
        count: 3,
      },
      {
        arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa huwas-sami'ul-'alim.",
        translation: "In the name of Allah with whose name nothing can harm in the earth or in the heaven, and He is the All-Hearing, the All-Knowing.",
        source: "Abu Dawud 5088, Tirmidhi 3388 — Whoever says this 3 times in the morning and evening, nothing will harm him",
        count: 3,
      },
    ],
  },
  {
    id: "after_prayer",
    title: "After Prayer (Salah)",
    arabic: "أذكار بعد الصلاة",
    emoji: "🤲",
    time: "After each Salah",
    items: [
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        transliteration: "Astaghfirullah.",
        translation: "I seek forgiveness from Allah.",
        source: "Muslim 591 — The Prophet ﷺ would say this 3 times after finishing salah",
        count: 3,
      },
      {
        arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        transliteration: "Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.",
        translation: "O Allah, You are As-Salam (Peace) and from You is all peace, blessed are You, O Possessor of majesty and honor.",
        source: "Muslim 591",
        count: 1,
      },
      {
        arabic: "سُبْحَانَ اللَّهِ",
        transliteration: "SubhanAllah.",
        translation: "Glory be to Allah.",
        source: "Muslim 597",
        count: 33,
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alhamdulillah.",
        translation: "All praise is due to Allah.",
        source: "Muslim 597",
        count: 33,
      },
      {
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        source: "Muslim 597",
        count: 33,
      },
      {
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir.",
        translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
        source: "Muslim 597 — Said after the 99 tasbih above",
        count: 1,
      },
      {
        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
        transliteration: "Ayatul Kursi",
        translation: "Recite the full Ayatul Kursi (Quran 2:255). Whoever recites it after every obligatory prayer, nothing stands between him and Paradise except death.",
        source: "Nasa'i, authenticated by Ibn Hibban and Al-Albani",
        count: 1,
      },
    ],
  },
  {
    id: "salah_positions",
    title: "During Salah",
    arabic: "أذكار الصلاة",
    emoji: "🕌",
    time: "During prayer positions",
    items: [
      {
        arabic: "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ",
        transliteration: "Allahumma ba'id bayni wa bayna khatayaya kama ba'adta baynal mashriqi wal maghrib, Allahumma naqqini minal khataya kama yunaqqath thawbul abyadu minad danas, Allahummaghsil khatayaya bil ma'i wath thalji wal barad.",
        translation: "O Allah, distance me from my sins as You have distanced the East from the West. O Allah, purify me of my sins as white cloth is purified of dirt. O Allah, wash away my sins with water, snow and hail.",
        source: "Bukhari 744, Muslim 598 — Dua after opening Takbeer (Istiftah)",
        count: 1,
      },
      {
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
        transliteration: "Subhanakal-lahumma wa bihamdik, wa tabarakasmuk, wa ta'ala jadduk, wa la ilaha ghayruk.",
        translation: "Glory be to You, O Allah, and all praise. Blessed is Your name and exalted is Your majesty. There is no god but You.",
        source: "Abu Dawud 775, Tirmidhi 243 — Alternative opening dua (used by many scholars)",
        count: 1,
      },
      {
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        transliteration: "Subhana rabbiyal 'azim.",
        translation: "Glory be to my Lord, the Most Great.",
        source: "Abu Dawud 869, Ibn Majah 887 — Said in Ruku (bowing) — minimum 3 times",
        count: 3,
      },
      {
        arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ",
        transliteration: "Sami'Allahu liman hamidah.",
        translation: "Allah hears whoever praises Him.",
        source: "Bukhari 722 — Said when rising from Ruku",
        count: 1,
      },
      {
        arabic: "رَبَّنَا وَلَكَ الْحَمْدُ",
        transliteration: "Rabbana wa lakal hamd.",
        translation: "Our Lord, and to You is all praise.",
        source: "Bukhari 722 — Said after rising from Ruku",
        count: 1,
      },
      {
        arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
        transliteration: "Subhana rabbiyal a'la.",
        translation: "Glory be to my Lord, the Most High.",
        source: "Abu Dawud 870, Ibn Majah 888 — Said in Sujud (prostration) — minimum 3 times",
        count: 3,
      },
      {
        arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي",
        transliteration: "Allahummaghfir li warhamni wahdin wa 'afini warzuqni.",
        translation: "O Allah, forgive me, have mercy on me, guide me, grant me wellbeing, and grant me sustenance.",
        source: "Abu Dawud 850, Tirmidhi 284 — Said between the two prostrations (Jalsah)",
        count: 1,
      },
      {
        arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu 'alayna wa 'ala 'ibadillahis-salihin, ashhadu an la ilaha illallah wa ashhadu anna Muhammadan 'abduhu wa rasuluh.",
        translation: "All greetings, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.",
        source: "Bukhari 831, Muslim 402 — Tashahhud (said in sitting position)",
        count: 1,
      },
      {
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
        transliteration: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad, kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid.",
        translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Verily You are full of praise and majesty. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Verily You are full of praise and majesty.",
        source: "Bukhari 3370, Muslim 406 — Salawat after Tashahhud (Ibrahimiyyah)",
        count: 1,
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
        transliteration: "Allahumma inni a'udhu bika min 'adhabi jahannam, wa min 'adhabill qabr, wa min fitnatil mahya wal mamat, wa min sharri fitnatil masihid dajjal.",
        translation: "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.",
        source: "Bukhari 1377, Muslim 588 — Dua said after Tashahhud before Tasleem",
        count: 1,
      },
    ],
  },
  {
    id: "mosque",
    title: "Entering the Mosque",
    arabic: "دعاء دخول المسجد",
    emoji: "🕌",
    time: "When entering/leaving mosque",
    items: [
      {
        arabic: "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "A'udhu billahil 'azim, wa biwajhihil karim, wa sultanihil qadim, minash shaytanir rajim.",
        translation: "I seek refuge in Allah the Almighty, in His noble Face, and in His eternal dominion, from the accursed devil.",
        source: "Abu Dawud 466 — Said before entering the mosque (right foot first)",
        count: 1,
      },
      {
        arabic: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Bismillah, was-salatu was-salamu 'ala rasulillah, Allahumma aftah li abwaba rahmatik.",
        translation: "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy.",
        source: "Muslim 713 — Said when entering the mosque",
        count: 1,
      },
      {
        arabic: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        transliteration: "Bismillah, was-salatu was-salamu 'ala rasulillah, Allahumma inni as'aluka min fadlik.",
        translation: "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, I ask You from Your bounty.",
        source: "Muslim 713 — Said when leaving the mosque (left foot first)",
        count: 1,
      },
    ],
  },
  {
    id: "toilet",
    title: "Entering the Toilet",
    arabic: "دعاء دخول الخلاء",
    emoji: "🚪",
    time: "Before/after using the toilet",
    items: [
      {
        arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        transliteration: "Bismillah, Allahumma inni a'udhu bika minal khubuthi wal khaba'ith.",
        translation: "In the name of Allah. O Allah, I seek refuge in You from the male and female evil spirits.",
        source: "Bukhari 142, Muslim 375 — Said before entering (left foot first)",
        count: 1,
      },
      {
        arabic: "غُفْرَانَكَ",
        transliteration: "Ghufranaka.",
        translation: "I ask You for forgiveness.",
        source: "Abu Dawud 30, Tirmidhi 7 — Said after leaving the toilet (right foot first)",
        count: 1,
      },
    ],
  },
  {
    id: "wudu",
    title: "During Wudu",
    arabic: "أذكار الوضوء",
    emoji: "💧",
    time: "During and after ablution",
    items: [
      {
        arabic: "بِسْمِ اللَّهِ",
        transliteration: "Bismillah.",
        translation: "In the name of Allah.",
        source: "Abu Dawud 101, Tirmidhi 25 — Said at the beginning of wudu",
        count: 1,
      },
      {
        arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        transliteration: "Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh.",
        translation: "I bear witness that there is no god but Allah alone, with no partner, and I bear witness that Muhammad is His servant and messenger.",
        source: "Muslim 234 — Said after completing wudu. The eight gates of Paradise will be opened for him.",
        count: 1,
      },
      {
        arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
        transliteration: "Allahumma j'alni minat-tawwabin waj'alni minal mutatahhirin.",
        translation: "O Allah, make me among those who repent and make me among those who purify themselves.",
        source: "Tirmidhi 55 — Said after wudu",
        count: 1,
      },
      {
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
        transliteration: "Subhanakal-lahumma wa bihamdik, ashhadu an la ilaha illa ant, astaghfiruka wa atubu ilayk.",
        translation: "Glory be to You, O Allah, and all praise. I bear witness that there is no god but You. I seek Your forgiveness and I turn to You in repentance.",
        source: "Nasa'i, authenticated by Al-Albani — Said after wudu",
        count: 1,
      },
    ],
  },
  {
    id: "sleep",
    title: "Before Sleep",
    arabic: "أذكار النوم",
    emoji: "😴",
    time: "Before sleeping",
    items: [
      {
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya.",
        translation: "In Your name, O Allah, I die and I live.",
        source: "Bukhari 6324",
        count: 1,
      },
      {
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak.",
        translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        source: "Abu Dawud 5045",
        count: 3,
      },
      {
        arabic: "سُبْحَانَ اللَّهِ",
        transliteration: "SubhanAllah.",
        translation: "Glory be to Allah.",
        source: "Bukhari 3113 — The Prophet ﷺ advised Fatimah and Ali to say this 33 times before sleep",
        count: 33,
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        transliteration: "Alhamdulillah.",
        translation: "All praise is due to Allah.",
        source: "Bukhari 3113",
        count: 33,
      },
      {
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar.",
        translation: "Allah is the Greatest.",
        source: "Bukhari 3113",
        count: 34,
      },
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾",
        transliteration: "Surah Al-Ikhlas, Al-Falaq, An-Nas",
        translation: "Recite Surah Al-Ikhlas, Al-Falaq and An-Nas — blow into cupped hands and wipe over the body (3 times).",
        source: "Bukhari 5017 — The Prophet ﷺ did this every night before sleep",
        count: 3,
      },
    ],
  },
];

// ---------- Helpers ----------
function parseTime(timeStr) {
  const clean = timeStr.replace(/\s*\(.*?\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
}

function formatTime(timeStr) {
  const clean = timeStr.replace(/\s*\(.*?\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0);
  return d.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getNextPrayer(timings) {
  const now = new Date();
  for (const prayer of ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]) {
    const t = parseTime(timings[prayer]);
    if (t > now) return { name: prayer, time: t };
  }
  const fajr = parseTime(timings["Fajr"]);
  fajr.setDate(fajr.getDate() + 1);
  return { name: "Fajr", time: fajr };
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getGreeting(timings) {
  if (!timings) return "As-salāmu ʿalaykum";
  const now = new Date();
  const fajr = parseTime(timings.Fajr);
  const dhuhr = parseTime(timings.Dhuhr);
  const asr = parseTime(timings.Asr);
  const maghrib = parseTime(timings.Maghrib);
  const isha = parseTime(timings.Isha);
  if (now >= fajr && now < dhuhr) return "Sabāḥ al-khayr 🌅";
  if (now >= dhuhr && now < asr) return "Muẓhir mubārak ☀️";
  if (now >= asr && now < maghrib) return "ʿAsr mubārak 🌤";
  if (now >= maghrib && now < isha) return "Masāʾ al-khayr 🌇";
  return "Laylah mubārakah 🌙";
}

// ---------- Islamic Events ----------
const ISLAMIC_EVENTS = [
  { month: 1, day: 1, name: "Islamic New Year", arabic: "رأس السنة الهجرية", emoji: "🌙", desc: "The first day of Muharram marks the beginning of the Islamic lunar year." },
  { month: 1, day: 10, name: "Day of Ashura", arabic: "يوم عاشوراء", emoji: "✨", desc: "A day of great significance. Fasting on this day expiates sins of the previous year. (Muslim 1162)" },
  { month: 3, day: 12, name: "Mawlid an-Nabi ﷺ", arabic: "المولد النبوي", emoji: "🌹", desc: "The birth of the Prophet Muhammad ﷺ in Makkah (12 Rabi al-Awwal, 570 CE)." },
  { month: 7, day: 27, name: "Isra wal Mi'raj", arabic: "الإسراء والمعراج", emoji: "🌃", desc: "The Night Journey of the Prophet ﷺ from Makkah to Jerusalem and his ascent to the heavens." },
  { month: 8, day: 15, name: "Laylatul Bara'ah", arabic: "ليلة البراءة", emoji: "⭐", desc: "The Night of Forgiveness — 15th of Sha'ban. A night recommended for worship and seeking forgiveness." },
  { month: 9, day: 1, name: "Ramadan Begins", arabic: "بداية شهر رمضان", emoji: "🌙", desc: "The blessed month of fasting begins. The month in which the Quran was revealed." },
  { month: 9, day: 27, name: "Laylatul Qadr", arabic: "ليلة القدر", emoji: "✨", desc: "The Night of Power — better than a thousand months (Quran 97:3). Seek it in the last 10 nights of Ramadan." },
  { month: 10, day: 1, name: "Eid ul-Fitr", arabic: "عيد الفطر", emoji: "🎉", desc: "The Festival of Breaking the Fast — celebrated on the first day of Shawwal after Ramadan." },
  { month: 12, day: 8, name: "Day of Arafah", arabic: "يوم عرفة", emoji: "🤲", desc: "The greatest day of Hajj. Fasting on this day expiates sins of two years. (Muslim 1162)" },
  { month: 12, day: 10, name: "Eid ul-Adha", arabic: "عيد الأضحى", emoji: "🐑", desc: "The Festival of Sacrifice — commemorating the willingness of Ibrahim ﷺ to sacrifice his son." },
  { month: 12, day: 11, name: "Days of Tashreeq Begin", arabic: "أيام التشريق", emoji: "📅", desc: "11th, 12th, and 13th of Dhul Hijjah — days of eating, drinking and remembering Allah." },
];

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qa'dah", "Dhul Hijjah",
];

// ---------- Main App ----------
export default function App() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [timings, setTimings] = useState(null);
  const [hijri, setHijri] = useState(null);
  const [gregorian, setGregorian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState("");
  const [nextPrayer, setNextPrayer] = useState(null);
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState("prayer");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [counts, setCounts] = useState({});

  // Quran state
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahVerses, setSurahVerses] = useState([]);
  const [quranLoading, setQuranLoading] = useState(false);
  const [quranError, setQuranError] = useState("")
  const [surahSearch, setSurahSearch] = useState("");

  // Calendar state
  const [calendarData, setCalendarData] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");

  // AI Companion state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "As-salāmu ʿalaykum wa raḥmatullāhi wa barakātuh 🌙\n\nI am your Hidayah AI companion. You may ask me questions about Islam — the Quran, Sunnah, fiqh, history, or daily life. I will do my best to provide answers with proper references from the Quran and authentic hadith.\n\nPlease note: For important personal rulings, always consult a qualified scholar. I am a learning tool, not a mufti."
    }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!timings) return;
    const next = getNextPrayer(timings);
    setNextPrayer(next);
    setCountdown(formatCountdown(next.time - now));
  }, [now, timings]);

  const fetchPrayerTimes = useCallback(async (lat, lon) => {
    setLoading(true);
    setError("");
    try {
      const today = new Date();
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}?latitude=${lat}&longitude=${lon}&method=3`
      );
      const data = await res.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijri(data.data.date.hijri);
        setGregorian(data.data.date.gregorian);
      } else {
        setError("Couldn't fetch prayer times. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location not supported on this device.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const country = data.address?.country || "";
          setLocationName(city ? `${city}, ${country}` : country);
        } catch { setLocationName(""); }
        fetchPrayerTimes(latitude, longitude);
      },
      () => {
        setError("Location permission denied. Please allow location access.");
        setLoading(false);
      }
    );
  }, [fetchPrayerTimes]);

  // Fetch surah list when Quran tab is opened
  useEffect(() => {
    if (activeTab !== "quran" || surahs.length > 0) return;
    (async () => {
      setQuranLoading(true);
      setQuranError("");
      try {
        const res = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await res.json();
        if (data.code === 200) setSurahs(data.data);
        else setQuranError("Couldn't load surah list. Try again.");
      } catch {
        setQuranError("Network error. Check your connection.");
      }
      setQuranLoading(false);
    })();
  }, [activeTab, surahs.length]);

  // Fetch calendar when tab opens
  useEffect(() => {
    if (activeTab !== "calendar" || calendarData) return;
    (async () => {
      setCalendarLoading(true);
      setCalendarError("");
      try {
        const now = new Date();
        const res = await fetch(
          `https://api.aladhan.com/v1/gToH/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`
        );
        const data = await res.json();
        if (data.code === 200) setCalendarData(data.data);
        else setCalendarError("Couldn't load calendar data.");
      } catch {
        setCalendarError("Network error. Check your connection.");
      }
      setCalendarLoading(false);
    })();
  }, [activeTab, calendarData]);

  async function loadSurah(surah) {
    setSelectedSurah(surah);
    setSurahVerses([]);
    setQuranLoading(true);
    setQuranError("");
    try {
      const [arabicRes, engRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`),
      ]);
      const arabicData = await arabicRes.json();
      const engData = await engRes.json();
      if (arabicData.code === 200 && engData.code === 200) {
        const merged = arabicData.data.ayahs.map((ayah, i) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: engData.data.ayahs[i]?.text || "",
        }));
        setSurahVerses(merged);
      } else {
        setQuranError("Couldn't load surah. Try again.");
      }
    } catch {
      setQuranError("Network error. Check your connection.");
    }
    setQuranLoading(false);
  }

  async function sendMessage() {
    if (!aiInput.trim() || aiLoading) return;
    const userMessage = { role: "user", content: aiInput.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setAiInput("");
    setAiLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: `You are a knowledgeable Islamic companion app called Hidayah AI. Your role is to help Muslims learn about Islam with authentic, sourced answers.

IMPORTANT RULES:
1. Always cite your sources — reference specific Quran verses (Surah name, chapter:verse) or hadith (book name, hadith number, narrator)
2. Start responses with an appropriate Islamic greeting or acknowledgment
3. Be respectful, warm, and scholarly in tone
4. If you are uncertain or the question involves complex personal rulings (fatwa), clearly say: "For this matter, I recommend consulting a qualified Islamic scholar (mufti)"
5. Never fabricate hadith or Quran references — if you don't have a clear source, say so honestly
6. Keep answers clear and accessible — avoid overly technical jargon unless necessary
7. For matters with scholarly differences (ikhtilaf), briefly mention the different positions
8. End important answers with a reminder that this is for learning and not a substitute for qualified scholarly guidance`,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content[0].text }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I couldn't process that. Please try again." }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please check your connection and try again." }]);
    }
    setAiLoading(false);
  }

  function tap(index) {
    const cat = selectedCategory;
    const target = cat.items[index].count;
    const key = `${cat.id}-${index}`;
    const current = counts[key] || 0;
    if (current < target) {
      setCounts((prev) => ({ ...prev, [key]: current + 1 }));
    }
  }

  function resetCount(index) {
    const key = `${selectedCategory.id}-${index}`;
    setCounts((prev) => ({ ...prev, [key]: 0 }));
  }

  return (
    <div style={styles.page}>
      <GlobalStyles />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.appName}>هِدَايَة</div>
            <div style={styles.appNameEn}>Hidayah</div>
          </div>
          <div style={styles.locationPill}>
            <MapPin size={12} color="#C9A84C" />
            <span style={styles.locationText}>{locationName || "Detecting..."}</span>
          </div>
        </div>

        {/* Dates */}
        {hijri && gregorian && (
          <div style={styles.dateRow}>
            <span style={styles.dateHijri}>{hijri.day} {hijri.month.en} {hijri.year} AH</span>
            <span style={styles.dateSep}>·</span>
            <span style={styles.dateGreg}>{gregorian.day} {gregorian.month.en} {gregorian.year}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === "prayer" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("prayer")}
        >
          🕌 Prayer
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "azkar" ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab("azkar"); setSelectedCategory(null); }}
        >
          📿 Azkar
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "quran" ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab("quran"); setSelectedSurah(null); setSurahSearch(""); }}
        >
          📖 Quran
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "calendar" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("calendar")}
        >
          📅 Calendar
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "ai" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("ai")}
        >
          🤖 AI
        </button>
      </div>

      {/* ===== PRAYER TIMES TAB ===== */}
      {activeTab === "prayer" && (
        <div style={styles.content}>
          {timings && <div style={styles.greeting}>{getGreeting(timings)}</div>}

          {error && (
            <div style={styles.errorCard}>
              <AlertCircle size={18} color="#E8601C" />
              <span>{error}</span>
            </div>
          )}

          {loading && !error && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingDot} />
              <div style={styles.loadingText}>Fetching prayer times…</div>
            </div>
          )}

          {!loading && !error && nextPrayer && (
            <div style={styles.countdownCard}>
              <div style={styles.countdownLabel}>Next Prayer</div>
              <div style={styles.countdownPrayer}>
                {PRAYER_EMOJI[nextPrayer.name]} {nextPrayer.name}
                <span style={styles.countdownArabic}> {PRAYER_ARABIC[nextPrayer.name]}</span>
              </div>
              <div style={styles.countdownTimer}>{countdown}</div>
              <div style={styles.countdownSub}>
                <Clock size={12} color="#C9A84C" /> {timings && formatTime(timings[nextPrayer.name])}
              </div>
            </div>
          )}

          {!loading && !error && timings && (
            <div style={styles.prayerList}>
              {PRAYERS.map((prayer) => {
                const isNext = nextPrayer?.name === prayer;
                const isPassed = parseTime(timings[prayer]) < now && !isNext;
                return (
                  <div
                    key={prayer}
                    style={{
                      ...styles.prayerRow,
                      ...(isNext ? styles.prayerRowNext : {}),
                      ...(isPassed ? styles.prayerRowPassed : {}),
                    }}
                  >
                    <div style={styles.prayerLeft}>
                      <span style={styles.prayerEmoji}>{PRAYER_EMOJI[prayer]}</span>
                      <div>
                        <div style={styles.prayerName}>{prayer}</div>
                        <div style={styles.prayerArabic}>{PRAYER_ARABIC[prayer]}</div>
                      </div>
                    </div>
                    <div style={styles.prayerRight}>
                      <div style={{ ...styles.prayerTime, ...(isNext ? styles.prayerTimeNext : {}) }}>
                        {formatTime(timings[prayer])}
                      </div>
                      {isNext && <div style={styles.nextBadge}>Next</div>}
                      {isPassed && <div style={styles.passedBadge}>✓</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={styles.footer}>
            <div style={styles.footerText}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
            <div style={styles.footerSub}>Prayer times via Aladhan API · Method: Muslim World League</div>
          </div>
        </div>
      )}

      {/* ===== AZKAR TAB ===== */}
      {activeTab === "azkar" && !selectedCategory && (
        <div style={styles.content}>
          <div style={styles.azkarTitle}>Daily Adhkar & Duas</div>
          <div style={styles.azkarSubtitle}>Tap a category to begin</div>
          <div style={styles.categoryGrid}>
            {AZKAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                style={styles.categoryCard}
                onClick={() => { setSelectedCategory(cat); setCounts({}); }}
              >
                <div style={styles.categoryEmoji}>{cat.emoji}</div>
                <div style={styles.categoryTitle}>{cat.title}</div>
                <div style={styles.categoryArabic}>{cat.arabic}</div>
                <div style={styles.categoryMeta}>{cat.items.length} adhkar · {cat.time}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "azkar" && selectedCategory && (
        <div style={styles.content}>
          <button style={styles.backBtn} onClick={() => setSelectedCategory(null)}>
            <ChevronLeft size={16} /> Back to categories
          </button>
          <div style={styles.catHeader}>
            <div style={styles.catEmoji}>{selectedCategory.emoji}</div>
            <div style={styles.catTitle}>{selectedCategory.title}</div>
            <div style={styles.catArabic}>{selectedCategory.arabic}</div>
            <div style={styles.catTime}>{selectedCategory.time}</div>
          </div>

          <div style={styles.dhikrList}>
            {selectedCategory.items.map((item, idx) => {
              const key = `${selectedCategory.id}-${idx}`;
              const current = counts[key] || 0;
              const done = current >= item.count;
              return (
                <div key={idx} style={{ ...styles.dhikrCard, ...(done ? styles.dhikrCardDone : {}) }}>
                  <div style={styles.dhikrArabic}>{item.arabic}</div>
                  <div style={styles.dhikrTranslit}>{item.transliteration}</div>
                  <div style={styles.dhikrTranslation}>{item.translation}</div>
                  <div style={styles.dhikrSource}>📖 {item.source}</div>
                  <div style={styles.dhikrFooter}>
                    <div style={styles.dhikrCount}>
                      <span style={{ ...styles.dhikrCurrent, ...(done ? styles.dhikrCurrentDone : {}) }}>
                        {current}
                      </span>
                      <span style={styles.dhikrSlash}>/</span>
                      <span style={styles.dhikrTarget}>{item.count}</span>
                    </div>
                    <div style={styles.dhikrBtns}>
                      <button style={styles.resetBtn} onClick={() => resetCount(idx)}>
                        <RotateCcw size={14} />
                      </button>
                      <button
                        style={{ ...styles.tapBtn, ...(done ? styles.tapBtnDone : {}) }}
                        onClick={() => tap(idx)}
                        disabled={done}
                      >
                        {done ? "✓ Done" : "Tap"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* ===== AI COMPANION TAB ===== */}
      {activeTab === "ai" && (
        <div style={styles.aiPage}>
          <div style={styles.aiHeader}>
            <div style={styles.aiTitle}>🤖 Hidayah AI</div>
            <div style={styles.aiSubtitle}>Ask anything about Islam — sourced answers from Quran & Sunnah</div>
            <div style={styles.aiDisclaimer}>⚠️ For important rulings, consult a qualified scholar</div>
          </div>

          {/* Messages */}
          <div style={styles.aiMessages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.aiMessage,
                  ...(msg.role === "user" ? styles.aiMessageUser : styles.aiMessageAssistant),
                }}
              >
                {msg.role === "assistant" && (
                  <div style={styles.aiAvatar}>🌙</div>
                )}
                <div
                  style={{
                    ...styles.aiMessageBubble,
                    ...(msg.role === "user" ? styles.aiMessageBubbleUser : styles.aiMessageBubbleAssistant),
                  }}
                >
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div style={styles.aiMessage}>
                <div style={styles.aiAvatar}>🌙</div>
                <div style={styles.aiTyping}>
                  <span style={styles.aiDot} />
                  <span style={styles.aiDot} />
                  <span style={styles.aiDot} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={styles.aiInputRow}>
            <input
              style={styles.aiInput}
              placeholder="Ask about Islam..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={aiLoading}
            />
            <button
              style={{ ...styles.aiSendBtn, ...(aiLoading ? styles.aiSendBtnDisabled : {}) }}
              onClick={sendMessage}
              disabled={aiLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===== CALENDAR TAB ===== */}
      {activeTab === "calendar" && (
        <div style={styles.content}>
          <div style={styles.azkarTitle}>التقويم الهجري</div>
          <div style={styles.azkarSubtitle}>Islamic Hijri Calendar</div>

          {calendarError && (
            <div style={styles.errorCard}>
              <AlertCircle size={18} color="#E8601C" />
              <span>{calendarError}</span>
            </div>
          )}

          {calendarLoading && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingDot} />
              <div style={styles.loadingText}>Loading calendar…</div>
            </div>
          )}

          {!calendarLoading && calendarData && (
            <>
              {/* Today's date card */}
              <div style={styles.calTodayCard}>
                <div style={styles.calTodayLabel}>Today</div>
                <div style={styles.calHijriDate}>
                  {calendarData.hijri.day} {calendarData.hijri.month.en} {calendarData.hijri.year}
                </div>
                <div style={styles.calHijriArabic}>
                  {calendarData.hijri.day} {calendarData.hijri.month.ar} {calendarData.hijri.year} هـ
                </div>
                <div style={styles.calGreg}>
                  {calendarData.gregorian.weekday.en}, {calendarData.gregorian.day} {calendarData.gregorian.month.en} {calendarData.gregorian.year}
                </div>
                {calendarData.hijri.holidays && calendarData.hijri.holidays.length > 0 && (
                  <div style={styles.calHolidayBadge}>
                    ✨ {calendarData.hijri.holidays[0]}
                  </div>
                )}
              </div>

              {/* Current Hijri month info */}
              <div style={styles.calMonthCard}>
                <div style={styles.calMonthTitle}>
                  <Calendar size={16} color={GOLD} />
                  Current Month: {calendarData.hijri.month.en}
                </div>
                <div style={styles.calMonthArabic}>{calendarData.hijri.month.ar}</div>
                <div style={styles.calMonthNum}>Month {calendarData.hijri.month.number} of 12</div>
              </div>

              {/* Upcoming Islamic Events */}
              <div style={styles.calSectionTitle}>📅 Islamic Events This Year</div>
              <div style={styles.eventList}>
                {ISLAMIC_EVENTS.map((event, idx) => {
                  const currentMonth = parseInt(calendarData.hijri.month.number);
                  const currentDay = parseInt(calendarData.hijri.day);
                  const isPast = event.month < currentMonth ||
                    (event.month === currentMonth && event.day < currentDay);
                  const isToday = event.month === currentMonth && event.day === currentDay;

                  return (
                    <div
                      key={idx}
                      style={{
                        ...styles.eventCard,
                        ...(isToday ? styles.eventCardToday : {}),
                        ...(isPast ? styles.eventCardPast : {}),
                      }}
                    >
                      <div style={styles.eventHeader}>
                        <span style={styles.eventEmoji}>{event.emoji}</span>
                        <div style={styles.eventInfo}>
                          <div style={styles.eventName}>{event.name}</div>
                          <div style={styles.eventArabic}>{event.arabic}</div>
                        </div>
                        <div style={styles.eventDate}>
                          <div style={styles.eventDateNum}>{event.day}</div>
                          <div style={styles.eventDateMonth}>{HIJRI_MONTHS[event.month - 1].split(" ")[0]}</div>
                        </div>
                      </div>
                      <div style={styles.eventDesc}>{event.desc}</div>
                      {isToday && <div style={styles.todayBadge}>Today!</div>}
                    </div>
                  );
                })}
              </div>

              {/* Hijri months reference */}
              <div style={styles.calSectionTitle}>📖 Hijri Months</div>
              <div style={styles.monthsGrid}>
                {HIJRI_MONTHS.map((month, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.monthChip,
                      ...(idx + 1 === parseInt(calendarData.hijri.month.number) ? styles.monthChipActive : {}),
                    }}
                  >
                    <span style={styles.monthNum}>{idx + 1}</span>
                    <span style={styles.monthName}>{month}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ===== QURAN TAB — Surah List ===== */}
      {activeTab === "quran" && !selectedSurah && (
        <div style={styles.content}>
          <div style={styles.azkarTitle}>القرآن الكريم</div>
          <div style={styles.azkarSubtitle}>The Noble Quran — 114 Surahs</div>

          {/* Search */}
          <div style={styles.quranSearchBar}>
            <BookOpen size={15} color="#C9A84C" />
            <input
              style={styles.quranSearchInput}
              placeholder="Search surah name..."
              value={surahSearch}
              onChange={(e) => setSurahSearch(e.target.value)}
            />
          </div>

          {quranError && (
            <div style={styles.errorCard}>
              <AlertCircle size={18} color="#E8601C" />
              <span>{quranError}</span>
            </div>
          )}

          {quranLoading && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingDot} />
              <div style={styles.loadingText}>Loading surahs…</div>
            </div>
          )}

          {!quranLoading && (
            <div style={styles.surahList}>
              {surahs
                .filter((s) =>
                  s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
                  s.name.includes(surahSearch)
                )
                .map((surah) => (
                  <button
                    key={surah.number}
                    style={styles.surahRow}
                    onClick={() => loadSurah(surah)}
                  >
                    <div style={styles.surahNumber}>{surah.number}</div>
                    <div style={styles.surahInfo}>
                      <div style={styles.surahName}>{surah.englishName}</div>
                      <div style={styles.surahMeta}>
                        {surah.englishNameTranslation} · {surah.numberOfAyahs} verses · {surah.revelationType}
                      </div>
                    </div>
                    <div style={styles.surahArabic}>{surah.name}</div>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ===== QURAN TAB — Surah Reader ===== */}
      {activeTab === "quran" && selectedSurah && (
        <div style={styles.content}>
          <button style={styles.backBtn} onClick={() => { setSelectedSurah(null); setSurahVerses([]); }}>
            <ChevronLeft size={16} /> All Surahs
          </button>

          <div style={styles.catHeader}>
            <div style={styles.surahReaderArabic}>{selectedSurah.name}</div>
            <div style={styles.catTitle}>{selectedSurah.englishName}</div>
            <div style={styles.catTime}>
              {selectedSurah.englishNameTranslation} · {selectedSurah.numberOfAyahs} verses · {selectedSurah.revelationType}
            </div>
          </div>

          {quranError && (
            <div style={styles.errorCard}>
              <AlertCircle size={18} color="#E8601C" />
              <span>{quranError}</span>
            </div>
          )}

          {quranLoading && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingDot} />
              <div style={styles.loadingText}>Loading {selectedSurah.englishName}…</div>
            </div>
          )}

          {!quranLoading && (
            <div style={styles.verseList}>
              {/* Bismillah for all surahs except Tawbah (9) and Al-Fatihah (1, it's part of it) */}
              {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
                <div style={styles.bismillah}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}
              {surahVerses.map((verse) => (
                <div key={verse.number} style={styles.verseCard}>
                  <div style={styles.verseNumberBadge}>{verse.number}</div>
                  <div style={styles.verseArabic}>{verse.arabic}</div>
                  <div style={styles.verseTranslation}>{verse.translation}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; background: #0B1929; }
      button { font-family: inherit; cursor: pointer; border: none; }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    `}</style>
  );
}

// ---------- Styles ----------
const MIDNIGHT = "#0B1929";
const DEEP = "#112240";
const CARD = "#1A2F4A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C875";
const TEXT = "#E8E0CC";
const MUTED = "#8B9DBF";
const GREEN = "#2D7A3A";
const FONT_ARABIC = "'Amiri', 'Scheherazade New', serif";
const FONT = "-apple-system, 'Segoe UI', sans-serif";

const styles = {
  page: { minHeight: "100vh", background: MIDNIGHT, color: TEXT, fontFamily: FONT, maxWidth: 480, margin: "0 auto" },
  header: { background: DEEP, padding: "20px 20px 14px", borderBottom: `1px solid ${CARD}` },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  appName: { fontFamily: FONT_ARABIC, fontSize: 26, color: GOLD, lineHeight: 1.2 },
  appNameEn: { fontSize: 11, color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase" },
  locationPill: { display: "flex", alignItems: "center", gap: 5, background: CARD, borderRadius: 20, padding: "5px 10px" },
  locationText: { fontSize: 11.5, color: MUTED },
  dateRow: { display: "flex", alignItems: "center", gap: 8 },
  dateHijri: { fontSize: 12.5, color: GOLD },
  dateSep: { color: MUTED, fontSize: 10 },
  dateGreg: { fontSize: 12.5, color: MUTED },
  tabs: { display: "flex", background: DEEP, borderBottom: `1px solid ${CARD}` },
  tab: { flex: 1, padding: "13px 8px", background: "none", color: MUTED, fontSize: 13.5, fontWeight: 600, borderBottom: "2px solid transparent" },
  tabActive: { color: GOLD, borderBottom: `2px solid ${GOLD}` },
  content: { padding: "16px 16px 60px" },
  greeting: { textAlign: "center", fontSize: 15, color: GOLD_LIGHT, marginBottom: 14, fontStyle: "italic" },
  errorCard: { display: "flex", alignItems: "center", gap: 10, background: "#2A1510", border: "1px solid #5A2A1A", borderRadius: 12, padding: "12px 16px", marginBottom: 14, color: "#E8A090", fontSize: 13.5 },
  loadingWrap: { textAlign: "center", padding: "40px 20px" },
  loadingDot: { width: 10, height: 10, borderRadius: "50%", background: GOLD, margin: "0 auto 12px", animation: "pulse 1.2s ease-in-out infinite" },
  loadingText: { color: MUTED, fontSize: 13.5 },
  countdownCard: { background: `linear-gradient(135deg, #1A3A5C, ${CARD})`, border: `1px solid ${GOLD}44`, borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 16 },
  countdownLabel: { fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 },
  countdownPrayer: { fontSize: 22, fontWeight: 700, color: TEXT, marginBottom: 8 },
  countdownArabic: { fontFamily: FONT_ARABIC, color: GOLD, fontSize: 18 },
  countdownTimer: { fontFamily: "monospace", fontSize: 36, color: GOLD_LIGHT, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6 },
  countdownSub: { display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 12.5, color: MUTED },
  prayerList: { display: "flex", flexDirection: "column", gap: 8 },
  prayerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: CARD, borderRadius: 12, padding: "12px 16px", border: "1px solid transparent" },
  prayerRowNext: { border: `1px solid ${GOLD}88`, background: "#1A3A5C" },
  prayerRowPassed: { opacity: 0.5 },
  prayerLeft: { display: "flex", alignItems: "center", gap: 12 },
  prayerEmoji: { fontSize: 20 },
  prayerName: { fontSize: 15, fontWeight: 600, color: TEXT },
  prayerArabic: { fontFamily: FONT_ARABIC, fontSize: 13, color: GOLD, marginTop: 1 },
  prayerRight: { textAlign: "right" },
  prayerTime: { fontSize: 15, fontWeight: 600, color: TEXT },
  prayerTimeNext: { color: GOLD_LIGHT },
  nextBadge: { fontSize: 10, background: GOLD, color: MIDNIGHT, padding: "2px 7px", borderRadius: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 3 },
  passedBadge: { fontSize: 14, color: GREEN, marginTop: 2 },
  footer: { textAlign: "center", padding: "32px 0 0" },
  footerText: { fontFamily: FONT_ARABIC, fontSize: 18, color: GOLD, marginBottom: 6 },
  footerSub: { fontSize: 11, color: MUTED, fontStyle: "italic" },
  azkarTitle: { fontFamily: FONT_ARABIC, fontSize: 22, color: GOLD, textAlign: "center", marginBottom: 4 },
  azkarSubtitle: { fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 18 },
  categoryGrid: { display: "flex", flexDirection: "column", gap: 10 },
  categoryCard: { background: CARD, border: `1px solid #1E3A5A`, borderRadius: 14, padding: "16px", textAlign: "left", color: TEXT, width: "100%" },
  categoryEmoji: { fontSize: 24, marginBottom: 8 },
  categoryTitle: { fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 3 },
  categoryArabic: { fontFamily: FONT_ARABIC, fontSize: 14, color: GOLD, marginBottom: 5 },
  categoryMeta: { fontSize: 11.5, color: MUTED },
  backBtn: { display: "flex", alignItems: "center", gap: 5, background: "none", color: MUTED, fontSize: 13.5, padding: "0 0 14px", fontWeight: 600 },
  catHeader: { textAlign: "center", marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${CARD}` },
  catEmoji: { fontSize: 32, marginBottom: 6 },
  catTitle: { fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 4 },
  catArabic: { fontFamily: FONT_ARABIC, fontSize: 16, color: GOLD, marginBottom: 4 },
  catTime: { fontSize: 12, color: MUTED },
  dhikrList: { display: "flex", flexDirection: "column", gap: 14 },
  dhikrCard: { background: CARD, borderRadius: 14, padding: "16px", border: "1px solid #1E3A5A" },
  dhikrCardDone: { border: `1px solid ${GREEN}66`, background: "#0D2818" },
  dhikrArabic: { fontFamily: FONT_ARABIC, fontSize: 20, color: TEXT, lineHeight: 1.8, marginBottom: 10, direction: "rtl", textAlign: "right" },
  dhikrTranslit: { fontSize: 12.5, color: GOLD, fontStyle: "italic", marginBottom: 8 },
  dhikrTranslation: { fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 10 },
  dhikrSource: { fontSize: 11.5, color: "#5A7A9A", marginBottom: 12, fontStyle: "italic" },
  dhikrFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dhikrCount: { display: "flex", alignItems: "baseline", gap: 3 },
  dhikrCurrent: { fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: GOLD_LIGHT },
  dhikrCurrentDone: { color: GREEN },
  dhikrSlash: { color: MUTED, fontSize: 18 },
  dhikrTarget: { fontFamily: "monospace", fontSize: 18, color: MUTED },
  dhikrBtns: { display: "flex", gap: 8, alignItems: "center" },
  resetBtn: { background: DEEP, color: MUTED, borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center" },
  tapBtn: { background: GOLD, color: MIDNIGHT, borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: 14 },
  tapBtnDone: { background: GREEN, color: "#fff" },

  // Quran styles
  quranSearchBar: { display: "flex", alignItems: "center", gap: 10, background: CARD, border: `1px solid #1E3A5A`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 },
  quranSearchInput: { flex: 1, background: "none", border: "none", outline: "none", color: TEXT, fontSize: 14, fontFamily: FONT },
  surahList: { display: "flex", flexDirection: "column", gap: 6 },
  surahRow: { display: "flex", alignItems: "center", gap: 12, background: CARD, border: `1px solid #1E3A5A`, borderRadius: 12, padding: "12px 14px", width: "100%", textAlign: "left", color: TEXT },
  surahNumber: { width: 32, height: 32, borderRadius: "50%", background: DEEP, border: `1px solid ${GOLD}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 },
  surahInfo: { flex: 1, minWidth: 0 },
  surahName: { fontSize: 14.5, fontWeight: 600, color: TEXT },
  surahMeta: { fontSize: 11.5, color: MUTED, marginTop: 2 },
  surahArabic: { fontFamily: FONT_ARABIC, fontSize: 18, color: GOLD, flexShrink: 0 },
  surahReaderArabic: { fontFamily: FONT_ARABIC, fontSize: 32, color: GOLD, marginBottom: 6 },
  bismillah: { fontFamily: FONT_ARABIC, fontSize: 22, color: GOLD, textAlign: "center", padding: "16px 0", borderBottom: `1px solid ${CARD}`, marginBottom: 14 },
  verseList: { display: "flex", flexDirection: "column", gap: 12 },
  verseCard: { background: CARD, borderRadius: 12, padding: "14px", border: `1px solid #1E3A5A` },
  verseNumberBadge: { width: 28, height: 28, borderRadius: "50%", background: DEEP, border: `1px solid ${GOLD}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: GOLD, marginBottom: 10 },
  verseArabic: { fontFamily: FONT_ARABIC, fontSize: 20, color: TEXT, lineHeight: 2, direction: "rtl", textAlign: "right", marginBottom: 10 },
  verseTranslation: { fontSize: 13, color: MUTED, lineHeight: 1.7, borderTop: `1px solid #1E3A5A`, paddingTop: 10 },

  // Calendar styles
  calTodayCard: { background: `linear-gradient(135deg, #1A3A5C, ${CARD})`, border: `1px solid ${GOLD}66`, borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 14 },
  calTodayLabel: { fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 },
  calHijriDate: { fontSize: 24, fontWeight: 700, color: GOLD_LIGHT, marginBottom: 4 },
  calHijriArabic: { fontFamily: FONT_ARABIC, fontSize: 18, color: GOLD, marginBottom: 8 },
  calGreg: { fontSize: 13, color: MUTED },
  calHolidayBadge: { marginTop: 10, background: `${GOLD}22`, border: `1px solid ${GOLD}44`, borderRadius: 8, padding: "6px 12px", fontSize: 13, color: GOLD_LIGHT, display: "inline-block" },
  calMonthCard: { background: CARD, border: `1px solid #1E3A5A`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 },
  calMonthTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 4 },
  calMonthArabic: { fontFamily: FONT_ARABIC, fontSize: 16, color: GOLD, marginBottom: 2 },
  calMonthNum: { fontSize: 12, color: MUTED },
  calSectionTitle: { fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 12, marginTop: 4 },
  eventList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  eventCard: { background: CARD, border: `1px solid #1E3A5A`, borderRadius: 14, padding: "14px" },
  eventCardToday: { border: `1px solid ${GOLD}88`, background: "#1A3A5C" },
  eventCardPast: { opacity: 0.45 },
  eventHeader: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  eventEmoji: { fontSize: 22, flexShrink: 0 },
  eventInfo: { flex: 1, minWidth: 0 },
  eventName: { fontSize: 14.5, fontWeight: 600, color: TEXT, marginBottom: 2 },
  eventArabic: { fontFamily: FONT_ARABIC, fontSize: 13, color: GOLD },
  eventDate: { textAlign: "center", flexShrink: 0 },
  eventDateNum: { fontSize: 18, fontWeight: 700, color: GOLD_LIGHT, lineHeight: 1 },
  eventDateMonth: { fontSize: 10, color: MUTED, marginTop: 2 },
  eventDesc: { fontSize: 12.5, color: MUTED, lineHeight: 1.6 },
  todayBadge: { marginTop: 8, fontSize: 11, fontWeight: 700, color: GOLD, background: `${GOLD}22`, borderRadius: 6, padding: "3px 8px", display: "inline-block" },
  monthsGrid: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 },
  monthChip: { display: "flex", alignItems: "center", gap: 10, background: CARD, border: `1px solid #1E3A5A`, borderRadius: 10, padding: "10px 14px" },
  monthChipActive: { border: `1px solid ${GOLD}66`, background: "#1A3A5C" },
  monthNum: { fontFamily: "monospace", fontSize: 12, color: GOLD, width: 20, textAlign: "center" },
  monthName: { fontSize: 13.5, color: TEXT, fontWeight: 500 },

  // AI Companion styles
  aiPage: { display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" },
  aiHeader: { padding: "16px 16px 12px", borderBottom: `1px solid ${CARD}` },
  aiTitle: { fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 4 },
  aiSubtitle: { fontSize: 12.5, color: MUTED, marginBottom: 6 },
  aiDisclaimer: { fontSize: 11.5, color: "#8B6A2A", background: "#2A1F0A", borderRadius: 8, padding: "5px 10px", display: "inline-block" },
  aiMessages: { flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 },
  aiMessage: { display: "flex", alignItems: "flex-start", gap: 8 },
  aiMessageUser: { flexDirection: "row-reverse" },
  aiMessageAssistant: { flexDirection: "row" },
  aiAvatar: { fontSize: 20, flexShrink: 0, marginTop: 2 },
  aiMessageBubble: { maxWidth: "80%", borderRadius: 14, padding: "10px 14px", fontSize: 13.5, lineHeight: 1.6 },
  aiMessageBubbleUser: { background: GOLD, color: MIDNIGHT, borderBottomRightRadius: 4 },
  aiMessageBubbleAssistant: { background: CARD, color: TEXT, borderBottomLeftRadius: 4 },
  aiTyping: { display: "flex", alignItems: "center", gap: 5, background: CARD, borderRadius: 14, padding: "12px 16px" },
  aiDot: { width: 7, height: 7, borderRadius: "50%", background: GOLD, display: "inline-block", animation: "pulse 1.2s ease-in-out infinite" },
  aiInputRow: { display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${CARD}`, background: MIDNIGHT },
  aiInput: { flex: 1, background: CARD, border: `1px solid #1E3A5A`, borderRadius: 10, padding: "11px 14px", color: TEXT, fontSize: 14, fontFamily: FONT, outline: "none" },
  aiSendBtn: { background: GOLD, color: MIDNIGHT, border: "none", borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  aiSendBtnDisabled: { opacity: 0.5, cursor: "not-allowed" },
};
