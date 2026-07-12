import { useState, useEffect, useCallback } from "react";
import { MapPin, RefreshCw, Clock, AlertCircle, RotateCcw } from "lucide-react";

// ---------- Constants ----------
const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const PRAYER_ARABIC = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const PRAYER_EMOJI = {
  Fajr: "🌙",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤",
  Maghrib: "🌇",
  Isha: "🌃",
};

// ---------- Azkar Data ----------
const AZKAR_CATEGORIES = [
  {
    id: "morning",
    title: "Morning Adhkar",
    arabic: "أذكار الصباح",
    emoji: "🌅",
    time: "After Fajr",
    items: [
      { arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nاللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", transliteration: "Ayatul Kursi", translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence...", source: "Quran 2:255", count: 1 },
      { arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ", transliteration: "Surah Al-Ikhlas", translation: "Say: He is Allah, the One. Allah, the Eternal Refuge...", source: "Quran 112", count: 3 },
      { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ", transliteration: "Asbahna wa asbahal mulku lillah walhamdu lillah", translation: "We have reached the morning and at this very time all sovereignty belongs to Allah, and all praise is for Allah.", source: "Abu Dawud 5077", count: 1 },
      { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan nushur", translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.", source: "Abu Dawud 5068", count: 1 },
      { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", transliteration: "SubhanAllahi wa bihamdih", translation: "Glory be to Allah and all praise is due to Him.", source: "Bukhari 6405, Muslim 2692", count: 100 },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadir", translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.", source: "Bukhari 6403", count: 10 },
      { arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي", transliteration: "Allahumma afini fi badani, Allahumma afini fi sam'i, Allahumma afini fi basari", translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.", source: "Abu Dawud 5090", count: 3 },
    ],
  },
  {
    id: "evening",
    title: "Evening Adhkar",
    arabic: "أذكار المساء",
    emoji: "🌙",
    time: "After Asr",
    items: [
      { arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ", transliteration: "Amsayna wa amsal mulku lillah walhamdu lillah", translation: "We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah.", source: "Abu Dawud 5077", count: 1 },
      { arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal masir", translation: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the return.", source: "Abu Dawud 5068", count: 1 },
      { arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", transliteration: "SubhanAllahi wa bihamdih", translation: "Glory be to Allah and all praise is due to Him.", source: "Bukhari 6405, Muslim 2692", count: 100 },
      { arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", source: "Muslim 2709", count: 3 },
      { arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa huwas-sami'ul-'alim", translation: "In the name of Allah with whose name nothing can harm in the earth or in the heaven, and He is the All-Hearing, the All-Knowing.", source: "Abu Dawud 5088, Tirmidhi 3388", count: 3 },
    ],
  },
  {
    id: "after_prayer",
    title: "After Prayer",
    arabic: "أذكار بعد الصلاة",
    emoji: "🤲",
    time: "After each Salah",
    items: [
      { arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah.", source: "Muslim 591", count: 3 },
      { arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", transliteration: "Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram", translation: "O Allah, You are As-Salam (Peace) and from You is all peace, blessed are You, O Possessor of majesty and honor.", source: "Muslim 591", count: 1 },
      { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", translation: "Glory be to Allah.", source: "Muslim 597", count: 33 },
      { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", translation: "All praise is due to Allah.", source: "Muslim 597", count: 33 },
      { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest.", source: "Muslim 597", count: 33 },
      { arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadir", translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.", source: "Muslim 597", count: 1 },
      { arabic: "آيَةُ الْكُرْسِيِّ", transliteration: "Ayatul Kursi", translation: "Recite Ayatul Kursi (Quran 2:255)", source: "Nasa'i, Ibn Hibban", count: 1 },
    ],
  },
  {
    id: "sleep",
    title: "Before Sleep",
    arabic: "أذكار النوم",
    emoji: "😴",
    time: "Before sleeping",
    items: [
      { arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", transliteration: "Bismika Allahumma amutu wa ahya", translation: "In Your name, O Allah, I die and I live.", source: "Bukhari 6324", count: 1 },
      { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", translation: "Glory be to Allah.", source: "Bukhari 3113", count: 33 },
      { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", translation: "All praise is due to Allah.", source: "Bukhari 3113", count: 33 },
      { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest.", source: "Bukhari 3113", count: 34 },
      { arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", transliteration: "Allahumma qini adhabaka yawma tab'athu ibadak", translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.", source: "Abu Dawud 5045", count: 3 },
    ],
  },
];

// ---------- Helpers ----------
function parseTime(timeStr) {
  // timeStr is like "05:23 (WAT)" or "05:23"
  const clean = timeStr.replace(/\s*\(.*?\)/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  return d;
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
  // All prayers passed — next is Fajr tomorrow
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
  const [activeTab, setActiveTab] = useState("prayer"); // "prayer" | "azkar"
  const [selectedCategory, setSelectedCategory] = useState(null); // null = category list, object = active category
  const [counts, setCounts] = useState({}); // { itemIndex: currentCount }

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update countdown
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
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lon}&method=3`
      );
      const data = await res.json();

      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijri(data.data.date.hijri);
        setGregorian(data.data.date.gregorian);
      } else {
        setError("Couldn't fetch prayer times. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  }, []);

  const fetchLocationName = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "Your Location";
      setLocationName(city);
    } catch {
      setLocationName("Your Location");
    }
  }, []);

  const getLocation = useCallback(() => {
    setLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
        fetchPrayerTimes(latitude, longitude);
        fetchLocationName(latitude, longitude);
      },
      () => {
        // Default to Abuja, Nigeria if location denied
        setLocationName("Abuja, Nigeria");
        setLocation({ lat: 9.0579, lon: 7.4951 });
        fetchPrayerTimes(9.0579, 7.4951);
      }
    );
  }, [fetchPrayerTimes, fetchLocationName]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // ---------- Render ----------
  return (
    <div style={styles.page}>
      <GlobalStyles />
      <div style={styles.bgPattern} aria-hidden="true" />

      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.appName}>هداية</h1>
          <div style={styles.appNameLatin}>Hidayah</div>
        </div>
        <button style={styles.refreshBtn} onClick={getLocation} title="Refresh">
          <RefreshCw size={18} color="#C9A84C" />
        </button>
      </header>

      {/* Tab Navigation */}
      <div style={styles.tabRow}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === "prayer" ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab("prayer")}
        >
          🕌 Prayer Times
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === "azkar" ? styles.tabBtnActive : {}) }}
          onClick={() => { setActiveTab("azkar"); setSelectedCategory(null); setCounts({}); }}
        >
          📿 Azkar
        </button>
      </div>

      {/* ===== PRAYER TIMES TAB ===== */}
      {activeTab === "prayer" && (
        <>
          {/* Location */}
          <div style={styles.locationRow}>
            <MapPin size={14} color="#C9A84C" />
            <span style={styles.locationText}>{locationName || "Detecting location…"}</span>
          </div>

          {timings && <div style={styles.greeting}>{getGreeting(timings)}</div>}

          {hijri && gregorian && (
            <div style={styles.dateRow}>
              <div style={styles.dateCard}>
                <div style={styles.dateCardLabel}>Hijri</div>
                <div style={styles.dateCardValue}>{hijri.day} {hijri.month.en} {hijri.year}</div>
                <div style={styles.dateCardArabic}>{hijri.month.ar}</div>
              </div>
              <div style={styles.dateCard}>
                <div style={styles.dateCardLabel}>Gregorian</div>
                <div style={styles.dateCardValue}>{gregorian.day} {gregorian.month.en} {gregorian.year}</div>
                <div style={styles.dateCardArabic}>{gregorian.weekday.en}</div>
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorCard}>
              <AlertCircle size={18} color="#E8601C" />
              <span>{error}</span>
            </div>
          )}

          {loading && !error && (
            <div style={styles.loadingWrap}>
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
                <Clock size={12} color="#C9A84C" /> {formatTime(timings[nextPrayer.name])}
              </div>
            </div>
          )}

          {!loading && !error && timings && (
            <div style={styles.prayerList}>
              {PRAYERS.map((prayer) => {
                const isNext = nextPrayer?.name === prayer;
                const isPassed = parseTime(timings[prayer]) < now && !isNext;
                return (
                  <div key={prayer} style={{ ...styles.prayerRow, ...(isNext ? styles.prayerRowNext : {}), ...(isPassed ? styles.prayerRowPassed : {}) }}>
                    <div style={styles.prayerLeft}>
                      <span style={styles.prayerEmoji}>{PRAYER_EMOJI[prayer]}</span>
                      <div>
                        <div style={styles.prayerName}>{prayer}</div>
                        <div style={styles.prayerArabic}>{PRAYER_ARABIC[prayer]}</div>
                      </div>
                    </div>
                    <div style={styles.prayerRight}>
                      <div style={{ ...styles.prayerTime, ...(isNext ? styles.prayerTimeNext : {}) }}>{formatTime(timings[prayer])}</div>
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
            <div style={styles.footerSub}>In the name of Allah, the Most Gracious, the Most Merciful</div>
          </div>
        </>
      )}

      {/* ===== AZKAR TAB ===== */}
      {activeTab === "azkar" && (
        <div style={{ padding: "16px 20px 60px" }}>
          {!selectedCategory ? (
            <>
              <div style={styles.azkarHeader}>Choose your Adhkar</div>
              <div style={styles.azkarGrid}>
                {AZKAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    style={styles.azkarCategoryCard}
                    onClick={() => { setSelectedCategory(cat); setCounts({}); }}
                  >
                    <div style={styles.azkarCatEmoji}>{cat.emoji}</div>
                    <div style={styles.azkarCatTitle}>{cat.title}</div>
                    <div style={styles.azkarCatArabic}>{cat.arabic}</div>
                    <div style={styles.azkarCatTime}>{cat.time}</div>
                    <div style={styles.azkarCatCount}>{cat.items.length} adhkar</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button style={styles.backBtn} onClick={() => { setSelectedCategory(null); setCounts({}); }}>
                ← Back to Azkar
              </button>
              <div style={styles.azkarCatHeaderRow}>
                <div style={styles.azkarCatEmoji}>{selectedCategory.emoji}</div>
                <div>
                  <div style={styles.azkarCatTitle}>{selectedCategory.title}</div>
                  <div style={styles.azkarCatArabic}>{selectedCategory.arabic}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                {selectedCategory.items.map((item, idx) => {
                  const current = counts[idx] ?? 0;
                  const done = current >= item.count;
                  return (
                    <div key={idx} style={{ ...styles.azkarCard, ...(done ? styles.azkarCardDone : {}) }}>
                      <div style={styles.azkarArabic}>{item.arabic}</div>
                      <div style={styles.azkarTranslit}>{item.transliteration}</div>
                      <div style={styles.azkarTranslation}>{item.translation}</div>
                      <div style={styles.azkarSource}>📖 {item.source}</div>
                      <div style={styles.azkarCountRow}>
                        <div style={styles.azkarProgress}>
                          {done ? "✅ Complete" : `${current} / ${item.count}`}
                        </div>
                        {!done ? (
                          <button
                            style={styles.azkarTapBtn}
                            onClick={() => setCounts((prev) => ({ ...prev, [idx]: (prev[idx] ?? 0) + 1 }))}
                          >
                            Tap to count
                          </button>
                        ) : (
                          <button
                            style={styles.azkarResetBtn}
                            onClick={() => setCounts((prev) => ({ ...prev, [idx]: 0 }))}
                          >
                            <RotateCcw size={14} /> Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Global styles ----------
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; background: #0A1628; font-family: 'Inter', -apple-system, sans-serif; }
      button { cursor: pointer; font-family: inherit; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    `}</style>
  );
}

// ---------- Styles ----------
const GOLD = "#C9A84C";
const MIDNIGHT = "#0A1628";
const NAVY = "#0F2040";
const PARCHMENT = "#F8F4ED";
const FONT_ARABIC = "'Amiri', serif";
const FONT_BODY = "'Inter', -apple-system, sans-serif";

const styles = {
  page: {
    minHeight: "100vh",
    background: `linear-gradient(160deg, #0A1628 0%, #0F2040 50%, #0A1628 100%)`,
    color: PARCHMENT,
    fontFamily: FONT_BODY,
    maxWidth: 480,
    margin: "0 auto",
    paddingBottom: 40,
    position: "relative",
    overflowX: "hidden",
  },
  bgPattern: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 24px 8px",
    position: "relative",
    zIndex: 1,
  },
  appName: {
    fontFamily: FONT_ARABIC,
    fontSize: 36,
    color: GOLD,
    margin: 0,
    lineHeight: 1,
  },
  appNameLatin: {
    fontSize: 13,
    color: "#8B9DBF",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginTop: 2,
  },
  refreshBtn: {
    background: "rgba(201,168,76,0.1)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  locationRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 24px 16px",
    position: "relative",
    zIndex: 1,
  },
  locationText: {
    fontSize: 13,
    color: "#8B9DBF",
  },
  greeting: {
    fontFamily: FONT_ARABIC,
    fontSize: 18,
    color: GOLD,
    textAlign: "center",
    padding: "0 24px 20px",
    position: "relative",
    zIndex: 1,
  },
  dateRow: {
    display: "flex",
    gap: 12,
    padding: "0 24px 20px",
    position: "relative",
    zIndex: 1,
  },
  dateCard: {
    flex: 1,
    background: "rgba(201,168,76,0.08)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 14,
    padding: "14px 16px",
    textAlign: "center",
  },
  dateCardLabel: {
    fontSize: 10,
    color: "#8B9DBF",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 6,
  },
  dateCardValue: {
    fontSize: 13,
    fontWeight: 600,
    color: PARCHMENT,
    marginBottom: 4,
  },
  dateCardArabic: {
    fontFamily: FONT_ARABIC,
    fontSize: 15,
    color: GOLD,
  },
  errorCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(232,96,28,0.1)",
    border: "1px solid rgba(232,96,28,0.3)",
    borderRadius: 12,
    padding: "12px 16px",
    margin: "0 24px 20px",
    fontSize: 13,
    color: "#E8A07C",
    position: "relative",
    zIndex: 1,
  },
  loadingWrap: {
    textAlign: "center",
    padding: "40px 24px",
    position: "relative",
    zIndex: 1,
  },
  loadingText: {
    color: "#8B9DBF",
    fontSize: 14,
    animation: "pulse 1.5s ease-in-out infinite",
  },
  countdownCard: {
    margin: "0 24px 20px",
    background: `linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))`,
    border: "1px solid rgba(201,168,76,0.35)",
    borderRadius: 20,
    padding: "24px",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },
  countdownLabel: {
    fontSize: 11,
    color: "#8B9DBF",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 8,
  },
  countdownPrayer: {
    fontFamily: FONT_ARABIC,
    fontSize: 24,
    color: PARCHMENT,
    fontWeight: 700,
    marginBottom: 12,
  },
  countdownArabic: {
    color: GOLD,
  },
  countdownTimer: {
    fontFamily: "monospace",
    fontSize: 42,
    fontWeight: 700,
    color: GOLD,
    letterSpacing: "0.05em",
    lineHeight: 1,
    marginBottom: 10,
  },
  countdownSub: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    fontSize: 13,
    color: "#8B9DBF",
  },
  prayerList: {
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    position: "relative",
    zIndex: 1,
  },
  prayerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(15,32,64,0.8)",
    border: "1px solid rgba(139,157,191,0.15)",
    borderRadius: 14,
    padding: "14px 16px",
  },
  prayerRowNext: {
    background: "rgba(201,168,76,0.1)",
    border: "1px solid rgba(201,168,76,0.4)",
  },
  prayerRowPassed: {
    opacity: 0.5,
  },
  prayerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  prayerEmoji: {
    fontSize: 22,
  },
  prayerName: {
    fontSize: 15,
    fontWeight: 600,
    color: PARCHMENT,
  },
  prayerArabic: {
    fontFamily: FONT_ARABIC,
    fontSize: 13,
    color: GOLD,
    marginTop: 1,
  },
  prayerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  prayerTime: {
    fontFamily: "monospace",
    fontSize: 15,
    fontWeight: 600,
    color: "#8B9DBF",
  },
  prayerTimeNext: {
    color: GOLD,
  },
  nextBadge: {
    fontSize: 10,
    background: GOLD,
    color: MIDNIGHT,
    padding: "2px 7px",
    borderRadius: 5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  passedBadge: {
    fontSize: 14,
    color: "#2D7A3A",
  },
  footer: {
    textAlign: "center",
    padding: "32px 24px 0",
    position: "relative",
    zIndex: 1,
  },
  footerText: {
    fontFamily: FONT_ARABIC,
    fontSize: 18,
    color: GOLD,
    marginBottom: 6,
  },
  footerSub: {
    fontSize: 11,
    color: "#8B9DBF",
    fontStyle: "italic",
  },
};
