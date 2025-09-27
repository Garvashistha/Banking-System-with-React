import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRightLeft,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { dashboardApi } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import { Transaction } from '../types/transaction';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardApi.getDashboardData();
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          // Mock data for development
          setDashboardData({
            accountNumber: '****-****-****-1234',
            balance: 15750.00,
            transactions: [
              {
                id: 1,
                type: 'DEPOSIT',
                amount: 2500.00,
                accountNumber: '****-****-****-1234',
                timestamp: new Date().toISOString(),
                description: 'Salary deposit'
              },
              {
                id: 2,
                type: 'WITHDRAW',
                amount: 150.00,
                accountNumber: '****-****-****-1234',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                description: 'ATM withdrawal'
              },
              {
                id: 3,
                type: 'TRANSFER',
                amount: 500.00,
                accountNumber: '****-****-****-1234',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                description: 'Transfer to savings'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownRight className="h-4 w-4 text-success" />;
      case 'WITHDRAW':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="h-4 w-4 text-primary" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-success';
      case 'WITHDRAW':
        return 'text-destructive';
      case 'TRANSFER':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here's an overview of your account</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate('/deposit')} className="bg-gradient-success">
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          <Button onClick={() => navigate('/transfer')} variant="outline">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transfer
          </Button>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-card-hover shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="h-8 w-8 p-0"
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-balance">
              {showBalance ? formatCurrency(dashboardData?.balance || 0) : '••••••'}
            </div>
            <p className="text-xs text-muted-foreground">
              Account: {dashboardData?.accountNumber}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-card-hover shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(
                dashboardData?.transactions
                  ?.filter(t => t.type === 'DEPOSIT')
                  ?.reduce((sum, t) => sum + t.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.transactions?.filter(t => t.type === 'DEPOSIT').length || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="animate-card-hover shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(
                dashboardData?.transactions
                  ?.filter(t => t.type === 'WITHDRAW')
                  ?.reduce((sum, t) => sum + t.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.transactions?.filter(t => t.type === 'WITHDRAW').length || 0} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="animate-card-hover shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(
                dashboardData?.transactions
                  ?.filter(t => t.type === 'TRANSFER')
                  ?.reduce((sum, t) => sum + t.amount, 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.transactions?.filter(t => t.type === 'TRANSFER').length || 0} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Your latest banking activity</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/history')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.transactions?.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-transaction"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-background">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description || transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'DEPOSIT' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}