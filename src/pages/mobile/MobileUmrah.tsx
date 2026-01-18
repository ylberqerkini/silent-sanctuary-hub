import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  CheckCircle2, 
  MapPin, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  RotateCcw,
  Footprints,
  Scissors,
  Droplets,
  CloudOff
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { UmrahStepDetail } from '@/components/mobile/UmrahStepDetail';
import { useUmrahProgress } from '@/hooks/use-umrah-progress';

interface UmrahStep {
  id: string;
  titleEn: string;
  titleSq: string;
  descriptionEn: string;
  descriptionSq: string;
  icon: React.ElementType;
  location: string;
  duration: string;
  details: {
    instructionsEn: string[];
    instructionsSq: string[];
    duasEn?: string[];
    duasSq?: string[];
    tipsEn?: string[];
    tipsSq?: string[];
  };
}

const umrahSteps: UmrahStep[] = [
  {
    id: 'ihram',
    titleEn: 'Enter Ihram',
    titleSq: 'Hyni në Ihram',
    descriptionEn: 'Put on Ihram garments and make intention for Umrah',
    descriptionSq: 'Vishni rrobat e Ihramit dhe bëni nijetin për Umra',
    icon: Droplets,
    location: 'Miqat (designated boundary)',
    duration: '30-60 min',
    details: {
      instructionsEn: [
        'Take a full bath (Ghusl) before putting on Ihram',
        'Men: Wear two white unstitched cloths - one around waist (Izar), one over shoulders (Rida)',
        'Women: Wear normal modest clothing, face and hands uncovered',
        'Pray two Rakaat Sunnah if possible',
        'Make intention (Niyyah) for Umrah: "Labbayk Allahumma Umrah"',
        'Begin reciting Talbiyah continuously'
      ],
      instructionsSq: [
        'Merrni një banjë të plotë (Ghusl) para se të vishni Ihramin',
        'Burrat: Vishni dy pëlhura të bardha të paqepura - njërën rreth belit (Izar), tjetrën mbi shpatulla (Rida)',
        'Gratë: Vishni veshje normale modeste, fytyra dhe duart të zbuluara',
        'Faleni dy rekate Sunet nëse është e mundur',
        'Bëni nijetin për Umra: "Labbayk Allahumma Umrah"',
        'Filloni të recitoni Telbijen vazhdimisht'
      ],
      duasEn: [
        'Talbiyah: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk. Innal-hamda wan-ni\'mata laka wal-mulk, la sharika lak"',
        'Meaning: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace, and sovereignty belong to You. You have no partner."'
      ],
      duasSq: [
        'Telbija: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk. Innal-hamda wan-ni\'mata laka wal-mulk, la sharika lak"',
        'Kuptimi: "Ja ku jam, o Allah, ja ku jam. Ja ku jam, Ti nuk ke ortak, ja ku jam. Vërtet çdo lavdërim, mirësi dhe sovranitet i përkasin Ty. Ti nuk ke ortak."'
      ],
      tipsEn: [
        'Avoid perfumed soap or products after entering Ihram',
        'Keep spare Ihram clothes in case of accidents',
        'Stay calm and focused on your spiritual journey'
      ],
      tipsSq: [
        'Shmangni sapunin ose produktet me erë pas hyrjes në Ihram',
        'Mbani rroba rezervë Ihrami në rast aksidentesh',
        'Qëndroni të qetë dhe të përqendruar në udhëtimin tuaj shpirtëror'
      ]
    }
  },
  {
    id: 'tawaf',
    titleEn: 'Tawaf (Circumambulation)',
    titleSq: 'Tavafi (Rrotullimi)',
    descriptionEn: 'Walk around the Kaaba seven times counter-clockwise',
    descriptionSq: 'Ecni rreth Qabes shtatë herë kundër-orar',
    icon: RotateCcw,
    location: 'Around the Kaaba',
    duration: '45-90 min',
    details: {
      instructionsEn: [
        'Stop reciting Talbiyah upon seeing the Kaaba',
        'Start from the Black Stone (Hajr al-Aswad) corner',
        'Men: Uncover right shoulder (Idtiba) during Tawaf',
        'Try to touch or kiss the Black Stone, or point towards it saying "Bismillah, Allahu Akbar"',
        'Walk counter-clockwise keeping the Kaaba on your left',
        'Complete 7 full circuits ending at the Black Stone',
        'Pray 2 Rakaat behind Maqam Ibrahim after completing Tawaf'
      ],
      instructionsSq: [
        'Ndaloni recitimin e Telbijes kur të shihni Qaben',
        'Filloni nga qoshja e Gurit të Zi (Haxherul Esved)',
        'Burrat: Zbuloni shpatullën e djathtë (Idtiba) gjatë Tavafit',
        'Provoni të prekni ose puthni Gurin e Zi, ose drejtojuni duke thënë "Bismilah, Allahu Ekber"',
        'Ecni kundër-orar duke mbajtur Qaben në të majtën tuaj',
        'Plotësoni 7 rrotullime të plota duke mbaruar te Guri i Zi',
        'Falni 2 rekate pas Mekamit të Ibrahimit pasi të keni përfunduar Tavafin'
      ],
      duasEn: [
        'At the Black Stone: "Bismillahi Allahu Akbar"',
        'Between Yemeni Corner and Black Stone: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar"',
        'General supplication in your own language is encouraged'
      ],
      duasSq: [
        'Te Guri i Zi: "Bismilahi Allahu Ekber"',
        'Midis Qoshes Jemeni dhe Gurit të Zi: "Rabbena atina fid-dunja haseneten ve fil-ahireti haseneten ve kina adhabennar"',
        'Lutja e përgjithshme në gjuhën tuaj inkurajohet'
      ],
      tipsEn: [
        'Stay hydrated - Zamzam water stations are available',
        'If crowded, upper floors are less congested',
        'Maintain focus and avoid unnecessary conversation',
        'Wheelchairs are available for those who need them'
      ],
      tipsSq: [
        'Qëndroni të hidratuar - stacione uji Zemzem janë të disponueshme',
        'Nëse ka shumë njerëz, katet e sipërme janë më pak të mbushura',
        'Mbani përqendrimin dhe shmangni bisedat e panevojshme',
        'Karrocat janë të disponueshme për ata që kanë nevojë'
      ]
    }
  },
  {
    id: 'sai',
    titleEn: "Sa'i (Walking between Safa & Marwa)",
    titleSq: "Sa'i (Ecja midis Safas dhe Mervas)",
    descriptionEn: 'Walk between the hills of Safa and Marwa seven times',
    descriptionSq: 'Ecni midis kodrave të Safas dhe Mervas shtatë herë',
    icon: Footprints,
    location: 'Safa to Marwa corridor',
    duration: '45-90 min',
    details: {
      instructionsEn: [
        'Start at Mount Safa facing the Kaaba',
        'Recite: "Innas-Safa wal-Marwata min sha\'a\'irillah"',
        'Walk towards Marwa - this is one lap',
        'Men should jog lightly between the green lights',
        'Upon reaching Marwa, face the Kaaba and make dua',
        'Walk back to Safa - this is the second lap',
        'Complete 7 laps (ending at Marwa)',
        'Make dua throughout and remember Hajar\'s (AS) search for water'
      ],
      instructionsSq: [
        'Filloni te Mali Safa duke parë Qaben',
        'Recitoni: "Innes-Safa vel-Mervete min sha\'a\'iril-lah"',
        'Ecni drejt Mervas - kjo është një xhiro',
        'Burrat duhet të vrapojnë lehtë midis dritave të gjelbra',
        'Kur arrini Mervan, drejtojuni Qabes dhe bëni dua',
        'Kthehuni në Safa - kjo është xhiroja e dytë',
        'Plotësoni 7 xhiro (duke mbaruar në Merva)',
        'Bëni dua gjatë gjithë kohës dhe kujtoni kërkimin e Haxhares (AS) për ujë'
      ],
      duasEn: [
        'At Safa: "Innas-Safa wal-Marwata min sha\'a\'irillah" (Only first time)',
        'Facing Kaaba at each hill: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ala kulli shay\'in qadir"',
        'Make personal duas in between'
      ],
      duasSq: [
        'Në Safa: "Innes-Safa vel-Mervete min sha\'a\'iril-lah" (Vetëm herën e parë)',
        'Duke parë Qaben në çdo kodër: "La ilahe il-lallahu vahdehu la sherike leh, lehul-mulku ve lehul-hamdu ve huve ala kul-li shej\'in kadir"',
        'Bëni dua personale në mes'
      ],
      tipsEn: [
        'The corridor is air-conditioned and well-marked',
        'Wheelchairs and golf carts are available',
        'Count your laps carefully using a counter or app',
        'Rest areas are available if needed'
      ],
      tipsSq: [
        'Korridori është me kondicionim dhe i shënuar mirë',
        'Karrocat dhe karrocat e golfit janë të disponueshme',
        'Numëroni xhirot tuaja me kujdes duke përdorur numërues ose aplikacion',
        'Zona pushimi janë të disponueshme nëse nevojitet'
      ]
    }
  },
  {
    id: 'halq',
    titleEn: 'Halq/Taqsir (Shaving/Trimming Hair)',
    titleSq: 'Halk/Taksir (Rruarja/Shkurtimi i Flokëve)',
    descriptionEn: 'Shave or trim your hair to complete Umrah',
    descriptionSq: 'Rruani ose shkurtoni flokët për të përfunduar Umran',
    icon: Scissors,
    location: 'Barber shops near Haram',
    duration: '15-30 min',
    details: {
      instructionsEn: [
        'Men: Shave entire head (Halq - preferred) or trim hair equally from all sides (Taqsir)',
        'Women: Cut a fingertip length from the end of their hair',
        'After this step, all Ihram restrictions are lifted',
        'You may now change into regular clothes',
        'Your Umrah is complete! Alhamdulillah!'
      ],
      instructionsSq: [
        'Burrat: Rruani tërë kokën (Halk - i preferuar) ose shkurtoni flokët në mënyrë të barabartë nga të gjitha anët (Taksir)',
        'Gratë: Prisni një gjatësi majeje gishti nga fundi i flokëve',
        'Pas këtij hapi, të gjitha kufizimet e Ihramit hiqen',
        'Tani mund të visheni me rroba të rregullta',
        'Umra juaj ka përfunduar! Elhamdulilah!'
      ],
      tipsEn: [
        'Many barber shops are available near the Haram',
        'Prices are usually fixed - around 10-20 SAR',
        'Some prefer to do Halq for greater reward',
        'Keep your Ihram clothes for future use or as a keepsake'
      ],
      tipsSq: [
        'Shumë dyqane berberësh janë të disponueshme afër Haremit',
        'Çmimet zakonisht janë të fiksuara - rreth 10-20 SAR',
        'Disa preferojnë të bëjnë Halk për shpërblim më të madh',
        'Ruani rrobat tuaja të Ihramit për përdorim të ardhshëm ose si kujtim'
      ]
    }
  }
];

export default function MobileUmrah() {
  const { language, t } = useLanguage();
  const { completedSteps, toggleStep, resetProgress, isLoaded, getProgressInfo } = useUmrahProgress();
  const [selectedStep, setSelectedStep] = useState<UmrahStep | null>(null);

  const progress = (completedSteps.length / umrahSteps.length) * 100;
  const progressInfo = getProgressInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald/10 mb-3">
          <span className="text-3xl">🕋</span>
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {language === 'en' ? 'Umrah Guide' : 'Udhëzuesi i Umras'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' 
            ? 'Step-by-step guide to complete your Umrah' 
            : 'Udhëzues hap pas hapi për të përfunduar Umran tuaj'}
        </p>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-emerald/10 to-gold/5 border-emerald/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {language === 'en' ? 'Your Progress' : 'Progresi Juaj'}
            </span>
            <Badge variant="secondary" className="bg-emerald/10 text-emerald">
              {completedSteps.length}/{umrahSteps.length} {language === 'en' ? 'steps' : 'hapa'}
            </Badge>
          </div>
          <Progress value={progress} className="h-2 bg-muted mt-2" />
          
          {/* Offline indicator */}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <CloudOff className="h-3 w-3" />
            <span>
              {language === 'en' 
                ? 'Progress saved offline - works without internet' 
                : 'Progresi ruhet offline - punon pa internet'}
            </span>
          </div>

          {progressInfo.lastUpdated && completedSteps.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'en' ? 'Last updated: ' : 'Përditësuar: '}
              {progressInfo.lastUpdated.toLocaleDateString(language === 'en' ? 'en-US' : 'sq-AL', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}

          {completedSteps.length === umrahSteps.length && (
            <div className="mt-3 text-center">
              <p className="text-sm text-emerald font-medium">
                🎉 {language === 'en' ? 'Umrah Complete! Masha\'Allah!' : 'Umra Përfundoi! Masha\'Allah!'}
              </p>
            </div>
          )}
          {completedSteps.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetProgress}
              className="mt-2 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              {language === 'en' ? 'Reset Progress' : 'Rivendos Progresin'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Steps and Important Info */}
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="steps">
            {language === 'en' ? 'Steps' : 'Hapat'}
          </TabsTrigger>
          <TabsTrigger value="info">
            {language === 'en' ? 'Important Info' : 'Info të Rëndësishme'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="mt-4 space-y-3">
          {umrahSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const StepIcon = step.icon;
            
            return (
              <Card 
                key={step.id}
                className={`transition-all cursor-pointer ${
                  isCompleted ? 'bg-emerald/5 border-emerald/30' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedStep(step)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Step number and completion status */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(step.id);
                      }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-medium ${isCompleted ? 'text-emerald' : 'text-foreground'}`}>
                            {language === 'en' ? step.titleEn : step.titleSq}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {language === 'en' ? step.descriptionEn : step.descriptionSq}
                          </p>
                        </div>
                        <StepIcon className={`h-5 w-5 flex-shrink-0 ${isCompleted ? 'text-emerald' : 'text-muted-foreground'}`} />
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {step.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.duration}
                        </span>
                      </div>

                      {/* View details link */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-emerald">
                        <span>{language === 'en' ? 'View details' : 'Shiko detajet'}</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="info" className="mt-4 space-y-4">
          {/* Ihram Prohibitions */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Ihram Prohibitions' : 'Ndalesat e Ihramit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-2">
                {(language === 'en' ? [
                  'Cutting hair or nails',
                  'Using perfume or scented products',
                  'Men: Wearing stitched clothing or covering head',
                  'Women: Covering face or wearing gloves',
                  'Hunting or harming animals',
                  'Getting married or proposing',
                  'Sexual relations or intimate talk'
                ] : [
                  'Prerja e flokëve ose thonjve',
                  'Përdorimi i parfumit ose produkteve me erë',
                  'Burrat: Veshja e rrobave të qepura ose mbulimi i kokës',
                  'Gratë: Mbulimi i fytyrës ose veshja e dorezave',
                  'Gjuetia ose dëmtimi i kafshëve',
                  'Martesa ose propozimi',
                  'Marrëdhëniet seksuale ose biseda intime'
                ]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Essential Duas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald" />
                {language === 'en' ? 'Essential Duas' : 'Lutjet Thelbësore'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Talbiyah</p>
                <p className="text-sm text-muted-foreground italic">
                  "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk. Innal-hamda wan-ni'mata laka wal-mulk, la sharika lak"
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">
                  {language === 'en' ? 'Upon Seeing Kaaba' : 'Kur Shihni Qaben'}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "Allahumma zid hadhal-bayta tashrifan wa ta'ziman wa takriman wa mahabah"
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">
                  {language === 'en' ? 'Between Yemeni Corner & Black Stone' : 'Midis Qoshes Jemeni & Gurit të Zi'}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Practical Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {language === 'en' ? 'Practical Tips' : 'Këshilla Praktike'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="text-sm text-muted-foreground space-y-2">
                {(language === 'en' ? [
                  'Drink plenty of Zamzam water throughout',
                  'Wear comfortable, non-slip footwear',
                  'Keep your valuables secure at all times',
                  'Use a small bag to carry essentials',
                  'Rest when needed - no rush required',
                  'Maintain patience with crowds',
                  'Use upper floors of Haram if less crowded'
                ] : [
                  'Pini shumë ujë Zemzem gjatë gjithë kohës',
                  'Vishni këpucë të rehatshme, jo rrëshqitëse',
                  'Mbani gjësendet tuaja të sigurta në çdo kohë',
                  'Përdorni një çantë të vogël për gjërat thelbësore',
                  'Pushoni kur të keni nevojë - nuk ka nxitim',
                  'Ruani durimin me turmën',
                  'Përdorni katet e sipërme të Haremit nëse janë më pak të mbushura'
                ]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Step Detail Modal */}
      {selectedStep && (
        <UmrahStepDetail
          step={selectedStep}
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
          isCompleted={completedSteps.includes(selectedStep.id)}
          onToggleComplete={() => toggleStep(selectedStep.id)}
          language={language}
        />
      )}
    </div>
  );
}
