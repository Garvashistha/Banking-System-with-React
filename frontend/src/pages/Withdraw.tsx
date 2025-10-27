import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { transactionApi } from '../lib/api';

export default function Withdraw() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    if (!formData.accountNumber || !formData.amount) {
      setErrors({ general: 'Please fill in all fields' });
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors({ amount: 'Please enter a valid amount greater than 0' });
      return;
    }
    
    if (amount > 10000) {
      setErrors({ amount: 'Maximum withdrawal amount is ₹10,000' });
      return;
    }

    setLoading(true);
    
    try {
      const result = await transactionApi.withdraw({
        accountNumber: formData.accountNumber,
        amount: amount,
      });
      
      if (result.success) {
        toast({
          title: "Withdrawal Successful",
          description: `₹${amount.toFixed(2)} has been withdrawn from your account.`,
        });
        navigate('/dashboard');
      } else {
        setErrors({ general: 'error' in result ? result.error : 'Withdrawal failed. Please try again.' });
        toast({
          variant: "destructive",
          title: "Withdrawal Failed",
          description: 'error' in result ? result.error : 'Please try again later.',
        });
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred' });
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <ArrowUpRight className="h-6 w-6 text-destructive" />
        <h1 className="text-3xl font-bold tracking-tight">Withdraw Funds</h1>
      </div>
      
      <Alert className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Withdrawals may take 1-2 business days to process depending on your bank.
        </AlertDescription>
      </Alert>
      
      <Card className="max-w-md shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-destructive" />
            <span>Make a Withdrawal</span>
          </CardTitle>
          <CardDescription>
            Withdraw funds from your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={loading}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>
            
            {errors.general && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {errors.general}
              </div>
            )}
            
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="max-w-md bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Minimum withdrawal: ₹0.01</p>
            <p>• Maximum withdrawal: ₹10,000</p>
            <p>• Processing time: 1-2 business days</p>
            <p>• No withdrawal fees</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}