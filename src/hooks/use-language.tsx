import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'sq' | 'en';

interface Translations {
  [key: string]: {
    sq: string;
    en: string;
  };
}

export const translations: Translations = {
  // App branding
  appName: { sq: 'Xhamia e Qetë', en: 'Silent Masjid' },
  tagline: { sq: 'Lidhu me Allahun. Shkëputu nga Dunja.', en: 'Connect to Allah. Disconnect from Dunyah.' },
  
  // Navigation
  home: { sq: 'Kryefaqja', en: 'Home' },
  mosques: { sq: 'Xhamitë', en: 'Mosques' },
  alerts: { sq: 'Njoftimet', en: 'Alerts' },
  donate: { sq: 'Dhuro', en: 'Donate' },
  profile: { sq: 'Profili', en: 'Profile' },
  
  // Home screen
  currentStreak: { sq: 'Seria Aktuale', en: 'Current Streak' },
  days: { sq: 'ditë', en: 'days' },
  weeklyProgress: { sq: 'Progresi javor', en: 'Weekly progress' },
  visits: { sq: 'vizita', en: 'visits' },
  moreVisitsToGoal: { sq: 'vizita të tjera për të arritur qëllimin', en: 'more visits to reach your goal' },
  weeklyGoalAchieved: { sq: 'Qëllimi javor u arrit! Masha\'Allah!', en: 'Weekly goal achieved! Masha\'Allah!' },
  mosqueDetection: { sq: 'Zbulimi i Xhamisë', en: 'Mosque Detection' },
  inactive: { sq: 'Joaktiv', en: 'Inactive' },
  active: { sq: 'Aktiv', en: 'Active' },
  start: { sq: 'Fillo', en: 'Start' },
  stop: { sq: 'Ndalo', en: 'Stop' },
  qiblaFinder: { sq: 'Gjej Kiblen', en: 'Qibla Finder' },
  umrahMode: { sq: 'Umra', en: 'Umrah Mode' },
  qibla: { sq: 'Kibla', en: 'Qibla' },
  nearbyMosques: { sq: 'Xhamitë Afër', en: 'Nearby Mosques' },
  viewAll: { sq: 'Shiko të Gjitha', en: 'View All' },
  enableLocation: { sq: 'Aktivizo vendndodhjen për të parë xhamitë afër', en: 'Enable location to see nearby mosques' },
  dailyReminder: { sq: 'Përkujtimi i Ditës', en: 'Daily Reminder' },
  silenceReminder: { sq: '"Kur të hysh në xhami, heshte telefonin dhe zemrën për Allahun."', en: '"When you enter the masjid, silence your phone and your heart for Allah."' },
  
  // Mosques screen
  findMosquesNearYou: { sq: 'Gjej xhamitë afër teje', en: 'Find mosques near you' },
  searchMosques: { sq: 'Kërko xhamitë...', en: 'Search mosques...' },
  nearby: { sq: 'Afër', en: 'Nearby' },
  favorites: { sq: 'Të Preferuarat', en: 'Favorites' },
  verified: { sq: 'E Verifikuar', en: 'Verified' },
  navigate: { sq: 'Navigo', en: 'Navigate' },
  noMosquesFound: { sq: 'Nuk u gjetën xhami', en: 'No mosques found' },
  noFavoritesYet: { sq: 'Ende nuk ke xhami të preferuara', en: 'No favorite mosques yet' },
  tapHeartToAdd: { sq: 'Kliko zemrën për të shtuar preferuar', en: 'Tap the heart icon to add favorites' },
  submitNewMosque: { sq: 'Dërgo Xhami të Re', en: 'Submit New Mosque' },
  map: { sq: 'Harta', en: 'Map' },
  addressNotAvailable: { sq: 'Adresa nuk është e disponueshme', en: 'Address not available' },
  radius: { sq: 'rreze', en: 'radius' },
  
  // Profile screen
  guestUser: { sq: 'Përdorues Vizitor', en: 'Guest User' },
  signInToSync: { sq: 'Identifikohu për të sinkronizuar të dhënat në pajisje', en: 'Sign in to sync your data across devices' },
  signInOrCreate: { sq: 'Identifikohu ose Krijo Llogari', en: 'Sign In or Create Account' },
  longestStreak: { sq: 'Seria më e Gjatë', en: 'Longest Streak' },
  weeklyVisits: { sq: 'Vizitat Javore', en: 'Weekly Visits' },
  thisWeek: { sq: 'Këtë Javë', en: 'This Week' },
  notificationSettings: { sq: 'Cilësimet e Njoftimeve', en: 'Notification Settings' },
  autoSilentMode: { sq: 'Modaliteti i Qetë Automatik', en: 'Auto Silent Mode' },
  donationHistory: { sq: 'Historia e Dhurimeve', en: 'Donation History' },
  privacySecurity: { sq: 'Privatësia dhe Siguria', en: 'Privacy & Security' },
  helpSupport: { sq: 'Ndihmë dhe Mbështetje', en: 'Help & Support' },
  signOut: { sq: 'Dilni', en: 'Sign Out' },
  signedOutSuccess: { sq: 'U çidentifikuat me sukses', en: 'Signed out successfully' },
  
  // Auth screen
  welcomeBack: { sq: 'Mirë se Erdhe Përsëri', en: 'Welcome Back' },
  signInToContinue: { sq: 'Identifikohu për të vazhduar udhëtimin tënd shpirtëror', en: 'Sign in to continue your spiritual journey' },
  createAccount: { sq: 'Krijo Llogari', en: 'Create Account' },
  joinCommunity: { sq: 'Bashkohu me komunitetin tonë të besimtarëve', en: 'Join our community of believers' },
  email: { sq: 'Email', en: 'Email' },
  password: { sq: 'Fjalëkalimi', en: 'Password' },
  signIn: { sq: 'Identifikohu', en: 'Sign In' },
  signUp: { sq: 'Regjistrohu', en: 'Sign Up' },
  signingIn: { sq: 'Duke u identifikuar...', en: 'Signing in...' },
  creatingAccount: { sq: 'Duke krijuar llogari...', en: 'Creating account...' },
  dontHaveAccount: { sq: "Nuk ke llogari?", en: "Don't have an account?" },
  alreadyHaveAccount: { sq: 'Ke llogari?', en: 'Already have an account?' },
  continueAsGuest: { sq: 'Vazhdo si Vizitor', en: 'Continue as Guest' },
  
  // Prayer times
  prayerTimes: { sq: 'Kohët e Namazit', en: 'Prayer Times' },
  fajr: { sq: 'Sabahu', en: 'Fajr' },
  sunrise: { sq: 'Lindja e Diellit', en: 'Sunrise' },
  dhuhr: { sq: 'Dreka', en: 'Dhuhr' },
  asr: { sq: 'Ikindia', en: 'Asr' },
  maghrib: { sq: 'Akshami', en: 'Maghrib' },
  isha: { sq: 'Jacia', en: 'Isha' },
  couldNotLoadPrayerTimes: { sq: 'Nuk mund të ngarkoheshin kohët e namazit', en: 'Could not load prayer times' },
  retry: { sq: 'Riprovo', en: 'Retry' },
  
  // Geofencing
  locationTracking: { sq: 'Gjurmimi i Vendndodhjes', en: 'Location Tracking' },
  insideMosque: { sq: 'Jeni brenda xhamisë', en: 'You are inside a mosque' },
  mosquesNearby: { sq: 'xhami afër', en: 'mosques nearby' },
  noMosquesNearby: { sq: 'Nuk ka xhami afër', en: 'No mosques nearby' },
  locationPermissionDenied: { sq: 'Leja e vendndodhjes u refuzua', en: 'Location permission denied' },
  enableLocationServices: { sq: 'Aktivizo shërbimet e vendndodhjes', en: 'Enable location services' },
  locationDenied: { sq: 'Qasja në vendndodhje u refuzua. Aktivizoje në cilësimet.', en: 'Location access denied. Please enable in settings.' },
  gettingLocation: { sq: 'Duke marrë vendndodhjen tuaj...', en: 'Getting your location...' },
  pleaseAllowLocation: { sq: 'Lejoni qasjen në vendndodhje kur të pyeteni', en: 'Please allow location access when prompted' },
  locationAccessRequired: { sq: 'Kërkohet Qasje në Vendndodhje', en: 'Location Access Required' },
  enableLocationInstructions: { sq: 'Për të gjetur xhamitë afër jush, aktivizoni qasjen në vendndodhje në shfletues ose cilësimet e pajisjes.', en: 'To find mosques near you, please enable location access in your browser or device settings.' },
  tryAgain: { sq: 'Provo Përsëri', en: 'Try Again' },
  searchAgain: { sq: 'Kërko Përsëri', en: 'Search Again' },
  manualLocationSearch: { sq: 'Kërko Vendndodhjen Manualisht', en: 'Search Location Manually' },
  manualLocationDescription: { sq: 'Shkruaj emrin e qytetit ose adresën për të gjetur xhamitë afër.', en: 'Enter a city name or address to find mosques nearby.' },
  enterCityOrAddress: { sq: 'Shkruaj qytetin ose adresën...', en: 'Enter city or address...' },
  geocodingFailed: { sq: 'Kërkimi i vendndodhjes dështoi', en: 'Location search failed' },
  noLocationResults: { sq: 'Nuk u gjet asnjë vendndodhje', en: 'No locations found' },
  locationSet: { sq: 'Vendndodhja u përcaktua', en: 'Location set successfully' },
  orSearchManually: { sq: 'Ose kërko manualisht', en: 'Or search manually' },
  
  // Notifications
  notifications: { sq: 'Njoftimet', en: 'Notifications' },
  noNotifications: { sq: 'Nuk ka njofime', en: 'No notifications' },
  clearAll: { sq: 'Pastro të Gjitha', en: 'Clear All' },
  
  // Donate
  supportOurMission: { sq: 'Mbështet Misionin Tonë', en: 'Support Our Mission' },
  
  // Settings
  language: { sq: 'Gjuha', en: 'Language' },
  albanian: { sq: 'Shqip', en: 'Albanian' },
  english: { sq: 'Anglisht', en: 'English' },
  
  // Common
  loading: { sq: 'Duke ngarkuar...', en: 'Loading...' },
  error: { sq: 'Gabim', en: 'Error' },
  success: { sq: 'Sukses', en: 'Success' },
  cancel: { sq: 'Anulo', en: 'Cancel' },
  save: { sq: 'Ruaj', en: 'Save' },
  close: { sq: 'Mbyll', en: 'Close' },
  addedToFavorites: { sq: 'U shtua te preferuarat', en: 'Added to favorites' },
  removedFromFavorites: { sq: 'U hoq nga preferuarat', en: 'Removed from favorites' },
  pleaseSignInToSaveFavorites: { sq: 'Identifikohu për të ruajtur preferuarat', en: 'Please sign in to save favorites' },
  searchingNearby: { sq: 'Duke kërkuar afër vendndodhjes suaj', en: 'Searching near your location' },
  found: { sq: 'u gjetën', en: 'found' },
  searchingMosques: { sq: 'Duke kërkuar xhamitë afër...', en: 'Searching for nearby mosques...' },
  
  // Days
  mon: { sq: 'Hën', en: 'Mon' },
  tue: { sq: 'Mar', en: 'Tue' },
  wed: { sq: 'Mër', en: 'Wed' },
  thu: { sq: 'Enj', en: 'Thu' },
  fri: { sq: 'Pre', en: 'Fri' },
  sat: { sq: 'Sht', en: 'Sat' },
  sun: { sq: 'Die', en: 'Sun' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'silent-masjid-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'sq' || stored === 'en') {
        return stored;
      }
    }
    return 'sq'; // Default to Albanian
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
