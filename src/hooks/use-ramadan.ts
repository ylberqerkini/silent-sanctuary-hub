import { useState, useEffect, useCallback } from 'react';
import { format, differenceInDays, addDays, isAfter, isBefore, startOfDay } from 'date-fns';

export interface RamadanDay {
  day: number;
  gregorianDate: Date;
  hijriDate: string;
  isFasted: boolean;
  notes: string;
}

export interface RamadanProgress {
  days: RamadanDay[];
  totalFasted: number;
  currentDay: number;
  startDate: string; // Gregorian start date
  year: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'ramadan-progress';

// Ramadan 2025 dates (approximate - actual dates depend on moon sighting)
const RAMADAN_2025_START = new Date(2025, 2, 1); // March 1, 2025
const RAMADAN_2025_END = new Date(2025, 2, 30); // March 30, 2025

// Ramadan 2026 dates (approximate)
const RAMADAN_2026_START = new Date(2026, 1, 18); // February 18, 2026
const RAMADAN_2026_END = new Date(2026, 2, 19); // March 19, 2026

function getRamadanDates(year: number): { start: Date; end: Date } {
  if (year === 2025) {
    return { start: RAMADAN_2025_START, end: RAMADAN_2025_END };
  }
  return { start: RAMADAN_2026_START, end: RAMADAN_2026_END };
}

function initializeRamadanDays(startDate: Date): RamadanDay[] {
  const days: RamadanDay[] = [];
  for (let i = 0; i < 30; i++) {
    days.push({
      day: i + 1,
      gregorianDate: addDays(startDate, i),
      hijriDate: `Ramadan ${i + 1}`,
      isFasted: false,
      notes: ''
    });
  }
  return days;
}

export function useRamadan() {
  const [progress, setProgress] = useState<RamadanProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine current Ramadan year
  const currentYear = new Date().getFullYear();
  const ramadanDates = getRamadanDates(currentYear >= 2026 ? 2026 : 2025);

  // Calculate current Ramadan day
  const today = startOfDay(new Date());
  const isRamadan = !isBefore(today, ramadanDates.start) && !isAfter(today, ramadanDates.end);
  const currentRamadanDay = isRamadan 
    ? differenceInDays(today, ramadanDates.start) + 1 
    : 0;

  // Days until Ramadan starts (if not currently Ramadan)
  const daysUntilRamadan = isBefore(today, ramadanDates.start)
    ? differenceInDays(ramadanDates.start, today)
    : 0;

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Rehydrate dates
        parsed.days = parsed.days.map((day: any) => ({
          ...day,
          gregorianDate: new Date(day.gregorianDate)
        }));
        setProgress(parsed);
      } catch (e) {
        console.error('Failed to parse Ramadan progress:', e);
      }
    }
    
    // Initialize if no progress or different year
    if (!stored) {
      const initial: RamadanProgress = {
        days: initializeRamadanDays(ramadanDates.start),
        totalFasted: 0,
        currentDay: currentRamadanDay,
        startDate: ramadanDates.start.toISOString(),
        year: currentYear >= 2026 ? 2026 : 2025,
        lastUpdated: new Date().toISOString()
      };
      setProgress(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
    
    setIsLoading(false);
  }, []);

  // Save to localStorage
  const saveProgress = useCallback((newProgress: RamadanProgress) => {
    const updated = {
      ...newProgress,
      lastUpdated: new Date().toISOString()
    };
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  // Toggle fast for a specific day
  const toggleFast = useCallback((dayNumber: number) => {
    if (!progress) return;
    
    const newDays = progress.days.map(day => 
      day.day === dayNumber 
        ? { ...day, isFasted: !day.isFasted }
        : day
    );
    
    const totalFasted = newDays.filter(d => d.isFasted).length;
    
    saveProgress({
      ...progress,
      days: newDays,
      totalFasted,
      currentDay: currentRamadanDay
    });
  }, [progress, saveProgress, currentRamadanDay]);

  // Add note to a day
  const addNote = useCallback((dayNumber: number, note: string) => {
    if (!progress) return;
    
    const newDays = progress.days.map(day =>
      day.day === dayNumber
        ? { ...day, notes: note }
        : day
    );
    
    saveProgress({
      ...progress,
      days: newDays
    });
  }, [progress, saveProgress]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    const initial: RamadanProgress = {
      days: initializeRamadanDays(ramadanDates.start),
      totalFasted: 0,
      currentDay: currentRamadanDay,
      startDate: ramadanDates.start.toISOString(),
      year: currentYear >= 2026 ? 2026 : 2025,
      lastUpdated: new Date().toISOString()
    };
    saveProgress(initial);
  }, [ramadanDates.start, currentRamadanDay, saveProgress, currentYear]);

  return {
    progress,
    isLoading,
    isRamadan,
    currentRamadanDay,
    daysUntilRamadan,
    ramadanDates,
    toggleFast,
    addNote,
    resetProgress
  };
}

// Daily Ramadan Duas
export const RAMADAN_DUAS = [
  {
    day: 1,
    arabic: "اَللّهُمَّ اجْعَلْ صِيامي فيهِ صِيامَ الصّائِمينَ",
    transliteration: "Allahumma-ja'l siyami fihi siyamas-sa'imin",
    translation: "O Allah, make my fasting in it the fasting of those who truly fast",
    english: "O Allah, on this day make my fasts the fasts of those who fast sincerely"
  },
  {
    day: 2,
    arabic: "اَللّهُمَّ قَرِّبْني فيهِ إلى مَرْضاتِكَ",
    transliteration: "Allahumma qarribni fihi ila mardatik",
    translation: "O Allah, draw me closer to Your pleasure on this day",
    english: "O Allah, bring me closer to Your pleasure and away from Your anger"
  },
  {
    day: 3,
    arabic: "اَللّهُمَّ ارْزُقْني فيهِ الذِّهْنَ وَالتَّنْبيهَ",
    transliteration: "Allahummar-zuqni fihidh-dhihna wat-tanbih",
    translation: "O Allah, grant me awareness and alertness on this day",
    english: "O Allah, grant me wisdom and awareness"
  },
  {
    day: 4,
    arabic: "اَللّهُمَّ قَوِّني فيهِ على إقامَةِ أمْرِكَ",
    transliteration: "Allahumma qawwini fihi 'ala iqamati amrik",
    translation: "O Allah, strengthen me on this day to establish Your commands",
    english: "O Allah, give me strength to uphold Your commands"
  },
  {
    day: 5,
    arabic: "اَللّهُمَّ اجْعَلْني فيهِ مِنَ المُسْتَغْفِرينَ",
    transliteration: "Allahumma-ja'lni fihil minal mustaghfirin",
    translation: "O Allah, make me among those who seek forgiveness on this day",
    english: "O Allah, place me among those who seek forgiveness"
  },
  {
    day: 6,
    arabic: "اَللّهُمَّ لا تَخْذُلْني فيهِ لِتَعَرُّضِ مَعْصِيَتِكَ",
    transliteration: "Allahumma la takhdhulni fihi lita'arrudi ma'siyatik",
    translation: "O Allah, do not forsake me for committing disobedience to You",
    english: "O Allah, do not forsake me when I am tempted to disobey You"
  },
  {
    day: 7,
    arabic: "اَللّهُمَّ أعِنّي فيهِ على صِيامِهِ وَقِيامِهِ",
    transliteration: "Allahumma a'inni fihi 'ala siyamihi wa qiyamih",
    translation: "O Allah, help me with fasting and standing in prayer",
    english: "O Allah, help me with fasting and night prayers"
  },
  {
    day: 8,
    arabic: "اَللّهُمَّ ارْزُقْني فيهِ رَحْمَةَ الأيتامِ",
    transliteration: "Allahummar-zuqni fihi rahmatal-aytam",
    translation: "O Allah, grant me mercy towards orphans on this day",
    english: "O Allah, grant me compassion for orphans and the needy"
  },
  {
    day: 9,
    arabic: "اَللّهُمَّ اجْعَلْ لي فيهِ نَصيباً مِنْ رَحْمَتِكَ الواسِعَةِ",
    transliteration: "Allahumma-ja'l li fihi nasiban min rahmatika",
    translation: "O Allah, grant me a share of Your vast mercy",
    english: "O Allah, grant me a portion of Your vast mercy"
  },
  {
    day: 10,
    arabic: "اَللّهُمَّ اجْعَلْني فيهِ مِنَ المُتَوَكِّلينَ عَلَيْكَ",
    transliteration: "Allahumma-ja'lni fihi minal mutawakkilina 'alayk",
    translation: "O Allah, make me among those who rely on You",
    english: "O Allah, make me among those who trust in You completely"
  },
  {
    day: 11,
    arabic: "اَللّهُمَّ حَبِّبْ إلَيَّ فيهِ الإحْسانَ",
    transliteration: "Allahumma habbib ilayya fihil-ihsan",
    translation: "O Allah, make me love doing good on this day",
    english: "O Allah, make me love doing good deeds"
  },
  {
    day: 12,
    arabic: "اَللّهُمَّ زَيِّنّي فيهِ بِالسِّتْرِ وَالعَفافِ",
    transliteration: "Allahumma zayyinni fihi bis-sitri wal-'afaf",
    translation: "O Allah, adorn me with modesty and chastity",
    english: "O Allah, beautify me with modesty and purity"
  },
  {
    day: 13,
    arabic: "اَللّهُمَّ طَهِّرْني فيهِ مِنَ الدَّنَسِ",
    transliteration: "Allahumma tahhirni fihi minad-danas",
    translation: "O Allah, purify me from impurity on this day",
    english: "O Allah, cleanse me from all impurities"
  },
  {
    day: 14,
    arabic: "اَللّهُمَّ لا تُؤاخِذْني فيهِ بِالعَثَراتِ",
    transliteration: "Allahumma la tu'akhidhni fihi bil-'atharat",
    translation: "O Allah, do not hold me accountable for my mistakes",
    english: "O Allah, forgive my slips and mistakes"
  },
  {
    day: 15,
    arabic: "اَللّهُمَّ ارْزُقْني فيهِ طاعَةَ الخاشِعينَ",
    transliteration: "Allahummar-zuqni fihi ta'atal-khashi'in",
    translation: "O Allah, grant me the obedience of the humble",
    english: "O Allah, grant me the devotion of the humble worshippers"
  },
  {
    day: 16,
    arabic: "اَللّهُمَّ وَفِّقْني فيهِ لِمُوافَقَةِ الأبْرارِ",
    transliteration: "Allahumma waffiqni fihi limuwafaqatil-abrar",
    translation: "O Allah, grant me success in following the righteous",
    english: "O Allah, grant me the company of the righteous"
  },
  {
    day: 17,
    arabic: "اَللّهُمَّ اهْدِني فيهِ لِصالِحِ الأعْمالِ",
    transliteration: "Allahumma-hdini fihi lisalihil-a'mal",
    translation: "O Allah, guide me to righteous deeds on this day",
    english: "O Allah, guide me to good deeds"
  },
  {
    day: 18,
    arabic: "اَللّهُمَّ نَبِّهْني فيهِ لِبَرَكاتِ أسْحارِهِ",
    transliteration: "Allahumma nabbihni fihi libarakati asharih",
    translation: "O Allah, awaken me to the blessings of its early mornings",
    english: "O Allah, awaken me to the blessings of Suhoor time"
  },
  {
    day: 19,
    arabic: "اَللّهُمَّ وَفِّرْ حَظّي فيهِ مِنْ بَرَكاتِهِ",
    transliteration: "Allahumma waffir hazzi fihi min barakatih",
    translation: "O Allah, increase my share of its blessings",
    english: "O Allah, multiply my blessings in this month"
  },
  {
    day: 20,
    arabic: "اَللّهُمَّ افْتَحْ لي فيهِ أبْوابَ الجِنانِ",
    transliteration: "Allahumma-ftah li fihi abwabal-jinan",
    translation: "O Allah, open for me the gates of Paradise",
    english: "O Allah, open the gates of Paradise for me"
  },
  {
    day: 21,
    arabic: "اَللّهُمَّ اجْعَلْ لي فيهِ إلى مَرْضاتِكَ دَليلاً",
    transliteration: "Allahumma-ja'l li fihi ila mardatika dalila",
    translation: "O Allah, guide me to Your pleasure on this day",
    english: "O Allah, make a way for me to Your pleasure"
  },
  {
    day: 22,
    arabic: "اَللّهُمَّ افْتَحْ لي فيهِ أبْوابَ فَضْلِكَ",
    transliteration: "Allahumma-ftah li fihi abwaba fadlik",
    translation: "O Allah, open for me the doors of Your grace",
    english: "O Allah, open the doors of Your bounty for me"
  },
  {
    day: 23,
    arabic: "اَللّهُمَّ اغْسِلْني فيهِ مِنَ الذُّنوبِ",
    transliteration: "Allahumma-ghsilni fihi minadh-dhunub",
    translation: "O Allah, wash away my sins on this day",
    english: "O Allah, cleanse me of all sins"
  },
  {
    day: 24,
    arabic: "اَللّهُمَّ إنّي أسْألُكَ فيهِ ما يُرْضيكَ",
    transliteration: "Allahumma inni as'aluka fihi ma yurdik",
    translation: "O Allah, I ask You for what pleases You",
    english: "O Allah, I ask You for that which pleases You"
  },
  {
    day: 25,
    arabic: "اَللّهُمَّ اجْعَلْني فيهِ مُحِبّاً لأوْلِيائِكَ",
    transliteration: "Allahumma-ja'lni fihi muhibban li-awliya'ik",
    translation: "O Allah, make me love Your friends on this day",
    english: "O Allah, make me love those whom You love"
  },
  {
    day: 26,
    arabic: "اَللّهُمَّ اجْعَلْ سَعْيي فيهِ مَشْكوراً",
    transliteration: "Allahumma-ja'l sa'yi fihi mashkura",
    translation: "O Allah, make my efforts in it appreciated",
    english: "O Allah, make my efforts pleasing to You"
  },
  {
    day: 27,
    arabic: "اَللّهُمَّ ارْزُقْني فيهِ فَضْلَ لَيْلَةِ القَدْرِ",
    transliteration: "Allahummar-zuqni fihi fadla laylatil-qadr",
    translation: "O Allah, grant me the virtue of Laylatul Qadr",
    english: "O Allah, grant me the blessings of Laylatul Qadr"
  },
  {
    day: 28,
    arabic: "اَللّهُمَّ وَفِّرْ حَظّي فيهِ مِنَ النَّوافِلِ",
    transliteration: "Allahumma waffir hazzi fihil min-nawafil",
    translation: "O Allah, increase my share of voluntary prayers",
    english: "O Allah, increase my voluntary worship"
  },
  {
    day: 29,
    arabic: "اَللّهُمَّ غَشِّني فيهِ بِالرَّحْمَةِ",
    transliteration: "Allahumma ghashshini fihi bir-rahma",
    translation: "O Allah, cover me with mercy on this day",
    english: "O Allah, envelop me in Your mercy"
  },
  {
    day: 30,
    arabic: "اَللّهُمَّ اجْعَلْ صِيامي فيهِ بِالشُّكْرِ وَالقَبولِ",
    transliteration: "Allahumma-ja'l siyami fihi bish-shukri wal-qabul",
    translation: "O Allah, make my fasting complete with gratitude and acceptance",
    english: "O Allah, accept my fasting with gratitude"
  }
];

// Iftar Dua
export const IFTAR_DUA = {
  arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ العُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
  transliteration: "Dhahaba al-zama' wa abtalat al-'urooq wa thabata al-ajr in sha Allah",
  translation: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills"
};

// Suhoor Intention
export const SUHOOR_INTENTION = {
  arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
  transliteration: "Wa bisawmi ghadin nawaytu min shahri Ramadan",
  translation: "I intend to fast tomorrow in the month of Ramadan"
};
