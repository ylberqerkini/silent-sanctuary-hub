import { Heart, Gift, Target, Users, Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

const donationAmounts = [5, 10, 25, 50, 100];
const fundingGoal = 50000;
const currentFunding = 32500;

export default function MobileDonate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const { t } = useLanguage();

  const features = [
    t('supportFreeApps'),
    t('expandMosqueDb'),
    t('fundNewFeatures'),
    t('contributeSadaqah'),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
          <Heart className="h-8 w-8 text-gold" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {t('supportSilentMasjid')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('donationIsSadaqah')}
        </p>
      </div>

      {/* Funding Progress */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium">{t('fundingGoal')}</span>
            </div>
            <Badge variant="gold">
              {Math.round((currentFunding / fundingGoal) * 100)}% {t('funded')}
            </Badge>
          </div>
          <Progress
            value={(currentFunding / fundingGoal) * 100}
            className="h-3 bg-gold/20"
          />
          <div className="mt-2 flex justify-between text-sm">
            <span className="font-bold text-gold">
              ${currentFunding.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              ${fundingGoal.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>1,247 {t('generousDonors')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Why Donate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="h-5 w-5 text-emerald" />
            {t('whyDonate')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Donation Type */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Button
              variant={donationType === "one-time" ? "islamic" : "outline"}
              onClick={() => setDonationType("one-time")}
              className="w-full"
            >
              {t('oneTime')}
            </Button>
            <Button
              variant={donationType === "monthly" ? "gold" : "outline"}
              onClick={() => setDonationType("monthly")}
              className="w-full"
            >
              {t('monthly')}
            </Button>
          </div>

          {/* Amount Selection */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">{t('selectAmount')}</p>
            <div className="grid grid-cols-5 gap-2">
              {donationAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "islamic" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAmount(amount)}
                  className="text-sm"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Amount Display */}
          {selectedAmount && (
            <div className="mb-4 rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {donationType === "monthly" ? t('monthlyDonation') : t('oneTimeDonation')}
              </p>
              <p className="font-serif text-3xl font-bold text-foreground">
                ${selectedAmount}
              </p>
              {donationType === "monthly" && (
                <p className="text-xs text-muted-foreground">
                  = ${selectedAmount * 12}{t('perYear')}
                </p>
              )}
            </div>
          )}

          {/* Payment Buttons */}
          <div className="space-y-2">
            <Button variant="islamic" className="w-full" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              {t('payWithCard')}
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
              </svg>
              {t('paypal')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hadith Quote */}
      <Card className="border-none bg-gradient-to-r from-emerald to-emerald-dark text-white">
        <CardContent className="p-4">
          <p className="font-serif text-sm italic">
            {t('hadithQuote')}
          </p>
          <p className="mt-2 text-xs opacity-80">{t('prophetMuhammad')}</p>
        </CardContent>
      </Card>
    </div>
  );
}