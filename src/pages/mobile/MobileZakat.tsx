import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calculator, 
  Coins, 
  Banknote, 
  TrendingUp,
  Building2,
  Car,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Nisab values (approximate - users should verify current rates)
const GOLD_NISAB_GRAMS = 87.48; // 87.48 grams of gold
const SILVER_NISAB_GRAMS = 612.36; // 612.36 grams of silver
const ZAKAT_RATE = 0.025; // 2.5%

// Default gold/silver prices (USD per gram) - users can update
const DEFAULT_GOLD_PRICE = 75;
const DEFAULT_SILVER_PRICE = 0.85;

interface AssetCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  fields: {
    id: string;
    label: string;
    placeholder: string;
  }[];
}

const assetCategories: AssetCategory[] = [
  {
    id: 'cash',
    label: 'Cash & Bank',
    icon: <Banknote className="h-5 w-5" />,
    description: 'Cash on hand, savings, checking accounts',
    fields: [
      { id: 'cash_on_hand', label: 'Cash on Hand', placeholder: '0.00' },
      { id: 'bank_savings', label: 'Bank Savings', placeholder: '0.00' },
      { id: 'bank_checking', label: 'Checking Accounts', placeholder: '0.00' },
    ],
  },
  {
    id: 'precious_metals',
    label: 'Gold & Silver',
    icon: <Coins className="h-5 w-5" />,
    description: 'Gold, silver jewelry and bullion',
    fields: [
      { id: 'gold_value', label: 'Gold (total value)', placeholder: '0.00' },
      { id: 'silver_value', label: 'Silver (total value)', placeholder: '0.00' },
    ],
  },
  {
    id: 'investments',
    label: 'Investments',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'Stocks, mutual funds, retirement accounts',
    fields: [
      { id: 'stocks', label: 'Stocks & Shares', placeholder: '0.00' },
      { id: 'mutual_funds', label: 'Mutual Funds', placeholder: '0.00' },
      { id: 'retirement', label: 'Retirement Accounts (accessible)', placeholder: '0.00' },
      { id: 'crypto', label: 'Cryptocurrency', placeholder: '0.00' },
    ],
  },
  {
    id: 'business',
    label: 'Business Assets',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Business inventory, receivables',
    fields: [
      { id: 'inventory', label: 'Business Inventory', placeholder: '0.00' },
      { id: 'receivables', label: 'Accounts Receivable', placeholder: '0.00' },
    ],
  },
  {
    id: 'other',
    label: 'Other Assets',
    icon: <Car className="h-5 w-5" />,
    description: 'Rental income, money owed to you',
    fields: [
      { id: 'rental_income', label: 'Rental Income (annual)', placeholder: '0.00' },
      { id: 'money_owed', label: 'Money Owed to You', placeholder: '0.00' },
      { id: 'other_assets', label: 'Other Zakatable Assets', placeholder: '0.00' },
    ],
  },
];

const MobileZakat = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Record<string, number>>({});
  const [liabilities, setLiabilities] = useState({
    debts: 0,
    loans: 0,
    bills: 0,
  });
  const [goldPrice, setGoldPrice] = useState(DEFAULT_GOLD_PRICE);
  const [silverPrice, setSilverPrice] = useState(DEFAULT_SILVER_PRICE);

  const handleAssetChange = (fieldId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssets(prev => ({ ...prev, [fieldId]: numValue }));
  };

  const handleLiabilityChange = (field: keyof typeof liabilities, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLiabilities(prev => ({ ...prev, [field]: numValue }));
  };

  const calculations = useMemo(() => {
    // Calculate total assets
    const totalAssets = Object.values(assets).reduce((sum, val) => sum + val, 0);
    
    // Calculate total liabilities
    const totalLiabilities = Object.values(liabilities).reduce((sum, val) => sum + val, 0);
    
    // Net zakatable wealth
    const netWealth = totalAssets - totalLiabilities;
    
    // Calculate nisab thresholds
    const goldNisab = GOLD_NISAB_GRAMS * goldPrice;
    const silverNisab = SILVER_NISAB_GRAMS * silverPrice;
    
    // Use the lower nisab (silver) as is traditional
    const nisabThreshold = silverNisab;
    
    // Check if Zakat is due
    const isZakatDue = netWealth >= nisabThreshold;
    
    // Calculate Zakat amount
    const zakatDue = isZakatDue ? netWealth * ZAKAT_RATE : 0;
    
    return {
      totalAssets,
      totalLiabilities,
      netWealth,
      goldNisab,
      silverNisab,
      nisabThreshold,
      isZakatDue,
      zakatDue,
    };
  }, [assets, liabilities, goldPrice, silverPrice]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const resetCalculator = () => {
    setAssets({});
    setLiabilities({ debts: 0, loans: 0, bills: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/mobile')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Zakat Calculator</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCalculator}
              className="text-muted-foreground"
            >
              Reset
            </Button>
          </div>
        </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What is Zakat?</p>
                <p>
                  Zakat is 2.5% of your eligible wealth held for one lunar year above the nisab threshold. 
                  It purifies wealth and supports those in need.
                </p>
              </div>
              </div>
            </CardContent>
          </Card>

          {/* Nisab Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Nisab Threshold Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goldPrice" className="text-sm">Gold ($/gram)</Label>
                  <Input
                    id="goldPrice"
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="silverPrice" className="text-sm">Silver ($/gram)</Label>
                  <Input
                    id="silverPrice"
                    type="number"
                    value={silverPrice}
                    onChange={(e) => setSilverPrice(parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <div>
                  <p className="text-xs">Gold Nisab</p>
                  <p className="font-medium text-foreground">{formatCurrency(calculations.goldNisab)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs">Silver Nisab (used)</p>
                  <p className="font-medium text-foreground">{formatCurrency(calculations.silverNisab)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Your Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full">
                {assetCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {category.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{category.label}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {category.fields.map((field) => (
                          <div key={field.id} className="space-y-1.5">
                            <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
                            <Input
                              id={field.id}
                              type="number"
                              placeholder={field.placeholder}
                              value={assets[field.id] || ''}
                              onChange={(e) => handleAssetChange(field.id, e.target.value)}
                              className="h-9"
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Deductible Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Debts and obligations due within the year can be deducted from your zakatable wealth.
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="debts" className="text-sm">Outstanding Debts</Label>
                  <Input
                    id="debts"
                    type="number"
                    placeholder="0.00"
                    value={liabilities.debts || ''}
                    onChange={(e) => handleLiabilityChange('debts', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="loans" className="text-sm">Loans Due</Label>
                  <Input
                    id="loans"
                    type="number"
                    placeholder="0.00"
                    value={liabilities.loans || ''}
                    onChange={(e) => handleLiabilityChange('loans', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bills" className="text-sm">Bills & Obligations</Label>
                  <Input
                    id="bills"
                    type="number"
                    placeholder="0.00"
                    value={liabilities.bills || ''}
                    onChange={(e) => handleLiabilityChange('bills', e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card className={`border-2 ${calculations.isZakatDue ? 'border-primary' : 'border-muted'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Zakat Summary</span>
                {calculations.isZakatDue ? (
                  <Badge className="bg-primary">Zakat Due</Badge>
                ) : (
                  <Badge variant="secondary">Below Nisab</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assets</span>
                  <span className="font-medium">{formatCurrency(calculations.totalAssets)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Liabilities</span>
                  <span className="font-medium text-destructive">-{formatCurrency(calculations.totalLiabilities)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Net Zakatable Wealth</span>
                  <span className="font-semibold">{formatCurrency(calculations.netWealth)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nisab Threshold</span>
                  <span>{formatCurrency(calculations.nisabThreshold)}</span>
                </div>
              </div>

              {calculations.isZakatDue && (
                <>
                  <Separator />
                  <div className="bg-primary/10 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Your Zakat Obligation
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(calculations.zakatDue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      2.5% of {formatCurrency(calculations.netWealth)}
                    </p>
                  </div>
                </>
              )}

              {!calculations.isZakatDue && calculations.netWealth > 0 && (
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Your wealth is below the nisab threshold of {formatCurrency(calculations.nisabThreshold)}. 
                    Zakat is not obligatory at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground text-center">
                This calculator provides estimates based on your inputs. For specific rulings on Zakat, 
                please consult with a qualified Islamic scholar. Gold and silver prices should be updated 
                to current market rates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default MobileZakat;
