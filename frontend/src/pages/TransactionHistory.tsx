import { useState, useEffect } from 'react';
import { History, Search, ArrowUpRight, ArrowDownRight, ArrowRightLeft, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transactionApi } from '../lib/api';
import { Transaction } from '../types/transaction';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const result = await transactionApi.getHistory();
      if (result.success && result.data) {
        setTransactions(result.data);
      } else {
        // Mock data for development
        setTransactions([
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
            description: 'Transfer to savings',
            fromAccount: '****-****-****-1234',
            toAccount: '****-****-****-5678'
          },
          {
            id: 4,
            type: 'DEPOSIT',
            amount: 1000.00,
            accountNumber: '****-****-****-1234',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            description: 'Investment return'
          },
          {
            id: 5,
            type: 'WITHDRAW',
            amount: 75.00,
            accountNumber: '****-****-****-1234',
            timestamp: new Date(Date.now() - 345600000).toISOString(),
            description: 'Online purchase'
          },
          {
            id: 6,
            type: 'TRANSFER',
            amount: 250.00,
            accountNumber: '****-****-****-1234',
            timestamp: new Date(Date.now() - 432000000).toISOString(),
            description: 'Bill payment',
            fromAccount: '****-****-****-1234',
            toAccount: '****-****-****-9999'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
        return null;
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

  const getBadgeVariant = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return 'default';
      case 'WITHDRAW':
        return 'destructive';
      case 'TRANSFER':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.accountNumber.includes(searchTerm) ||
      transaction.amount.toString().includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-muted h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Complete history of your banking activities
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DEPOSIT">Deposits</SelectItem>
                <SelectItem value="WITHDRAW">Withdrawals</SelectItem>
                <SelectItem value="TRANSFER">Transfers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No transactions found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || typeFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters.' 
                  : 'Your transaction history will appear here.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="animate-transaction">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(transaction.type)}
                        <Badge variant={getBadgeVariant(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.description || transaction.type}</p>
                        {transaction.fromAccount && transaction.toAccount && (
                          <p className="text-xs text-muted-foreground">
                            {transaction.fromAccount} → {transaction.toAccount}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.accountNumber}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-success/10">
                <ArrowDownRight className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'DEPOSIT')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-destructive/10">
                <ArrowUpRight className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Withdrawals</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'WITHDRAW')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-primary/10">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transfers</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'TRANSFER')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}