import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

export default function CurrentAccount() {
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);
  const navigate = useNavigate();

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Current Account</h1>
        <p className="text-muted-foreground">
          Manage your current account for daily transactions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData ? formatCurrency(accountData.balance) : '₹0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current Account
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdraft Limit</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,000</div>
            <p className="text-xs text-muted-foreground">
              Available for emergencies
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Number</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData?.accountNumber || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current account ID
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Features</CardTitle>
          <CardDescription>Benefits of your current account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Unlimited Transactions</h3>
              <p className="text-sm text-muted-foreground">No limits on deposits and withdrawals</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Overdraft Protection</h3>
              <p className="text-sm text-muted-foreground">Up to ₹1,000 overdraft facility</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Free Debit Card</h3>
              <p className="text-sm text-muted-foreground">Access your money anywhere</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => navigate('/transfer')} className="gap-2">
          Transfer Funds <ArrowRight className="h-4 w-4" />
        </Button>
        <Button onClick={() => navigate('/history')} variant="outline" className="gap-2">
          View History <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
