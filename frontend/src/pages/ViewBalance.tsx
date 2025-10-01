import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/lib/api';

export default function ViewBalance() {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await dashboardApi.getDashboardData();
      if (response.success && response.data) {
        setAccountData(response.data);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const totalBalance = accountData?.balance || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">View Balance</h1>
          <p className="text-muted-foreground">
            Overview of all your account balances
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowBalance(!showBalance)}
        >
          {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>

      <Card className="bg-gradient-primary text-white">
        <CardHeader>
          <CardTitle className="text-white">Total Balance</CardTitle>
          <CardDescription className="text-white/80">
            Combined balance across all accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {showBalance ? formatCurrency(totalBalance) : '••••••'}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Savings Account</CardTitle>
              <CardDescription>High interest savings</CardDescription>
            </div>
            <Wallet className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Account Number</p>
              <p className="font-medium">{accountData?.accountNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">
                {showBalance ? formatCurrency(totalBalance * 0.6) : '••••••'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                2.5% APY
              </Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Current Account</CardTitle>
              <CardDescription>Daily transactions</CardDescription>
            </div>
            <CreditCard className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Account Number</p>
              <p className="font-medium">{accountData?.accountNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold">
                {showBalance ? formatCurrency(totalBalance * 0.4) : '••••••'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">$1,000 Overdraft</Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Quick overview of your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Total Accounts</p>
                <p className="text-sm text-muted-foreground">Active accounts</p>
              </div>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Combined Balance</p>
                <p className="text-sm text-muted-foreground">All accounts</p>
              </div>
              <p className="text-2xl font-bold">
                {showBalance ? formatCurrency(totalBalance) : '••••••'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
